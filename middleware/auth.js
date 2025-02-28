import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

export function authMiddleware(handler) {
    return async (req, res) => {
        // ข้าม middleware สำหรับ OPTIONS request
        if (req.method === 'OPTIONS') {
            return handler(req, res);
        }

        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // เชื่อมต่อฐานข้อมูลเพื่อตรวจสอบผู้ใช้
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'minecraft_mcth',
                password: process.env.DB_PASSWORD || 'Team@1234',
                database: process.env.DB_NAME || 'minecraft_mcth'
            });

            try {
                // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
                const [users] = await connection.execute(
                    'SELECT username, role FROM authme WHERE username = ?',
                    [decoded.username]
                );

                if (users.length === 0) {
                    throw new Error('ไม่พบผู้ใช้');
                }

                // เพิ่มข้อมูลผู้ใช้ใน request
                req.user = {
                    username: users[0].username,
                    role: users[0].role || 'user'
                };

                // ดำเนินการต่อไปยัง handler
                return handler(req, res);
            } finally {
                await connection.end();
            }
        } catch (error) {
            console.error('Auth Error:', error);
            return res.status(401).json({ error: 'Token ไม่ถูกต้อง' });
        }
    };
}

// Middleware สำหรับตรวจสอบสิทธิ์ admin
export function adminMiddleware(handler) {
    return async (req, res) => {
        try {
            // เรียกใช้ authMiddleware ก่อน
            await authMiddleware(async (req, res) => {
                // ตรวจสอบว่าเป็น admin หรือไม่
                if (req.user?.role !== 'admin') {
                    return res.status(403).json({ error: 'ไม่มีสิทธิ์ในการดำเนินการนี้' });
                }

                // ดำเนินการต่อไปยัง handler
                return handler(req, res);
            })(req, res);
        } catch (error) {
            console.error('Admin Middleware Error:', error);
            return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์' });
        }
    };
}

// Hook สำหรับตรวจสอบการเข้าสู่ระบบใน component
export function useAuth() {
    // โค้ดส่วนนี้จะอยู่ใน hooks/useAuth.js
    // จะส่งให้ในส่วนถัดไป
}