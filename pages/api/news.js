import mysql from 'mysql2/promise';
import { authMiddleware } from '../../middleware/auth';

// กำหนดประเภทข่าวที่อนุญาต
const VALID_CATEGORIES = [
    'announcement',  // ประกาศ
    'update',       // อัพเดท
    'event',        // กิจกรรม
    'maintenance',  // แจ้งปิดปรับปรุง
    'promotion'     // โปรโมชั่น
];

async function handler(req, res) {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'minecraft_mcth',
        password: process.env.DB_PASSWORD || 'Team@1234',
        database: process.env.DB_NAME || 'minecraft_mcth'
    });

    try {
        switch (req.method) {
            case 'GET':
                const { limit = 10, page = 1, categoryFilter } = req.query;
                const offset = (page - 1) * limit;

                // ตรวจสอบความถูกต้องของ category
                if (categoryFilter && !VALID_CATEGORIES.includes(categoryFilter)) {
                    return res.status(400).json({
                        error: 'ประเภทข่าวไม่ถูกต้อง',
                        validCategories: VALID_CATEGORIES
                    });
                }

                // สร้าง query พื้นฐาน
                let query = `
                    SELECT 
                        n.*,
                        a.realname as author_name
                    FROM news n
                    LEFT JOIN authme a ON n.author_username = a.username
                    WHERE n.is_published = 1
                `;

                const queryParams = [];

                // เพิ่มเงื่อนไขหมวดหมู่ถ้ามีการระบุ
                if (categoryFilter) {
                    query += ' AND n.category = ?';
                    queryParams.push(categoryFilter);
                }

                // เพิ่มการเรียงลำดับและการแบ่งหน้า
                query += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?';
                queryParams.push(Number(limit), Number(offset));

                const [news] = await connection.execute(query, queryParams);

                // ดึงจำนวนข่าวทั้งหมด
                const [countResult] = await connection.execute(
                    'SELECT COUNT(*) as total FROM news WHERE is_published = 1' +
                    (categoryFilter ? ' AND category = ?' : ''),
                    categoryFilter ? [categoryFilter] : []
                );

                res.status(200).json({
                    news,
                    pagination: {
                        total: countResult[0].total,
                        page: Number(page),
                        limit: Number(limit),
                        totalPages: Math.ceil(countResult[0].total / limit)
                    }
                });
                break;

            case 'POST':
                // ตรวจสอบสิทธิ์ admin
                if (req.user?.role !== 'admin') {
                    return res.status(403).json({ error: 'ไม่มีสิทธิ์ในการเพิ่มข่าว' });
                }

                const { title, content, category, image_url } = req.body;

                // ตรวจสอบข้อมูลที่จำเป็น
                if (!title || !content || !category) {
                    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
                }

                // ตรวจสอบประเภทข่าว
                if (!VALID_CATEGORIES.includes(category)) {
                    return res.status(400).json({
                        error: 'ประเภทข่าวไม่ถูกต้อง',
                        validCategories: VALID_CATEGORIES
                    });
                }

                // เพิ่มข่าวใหม่
                const [result] = await connection.execute(
                    `INSERT INTO news (
                        title, 
                        content, 
                        category, 
                        image_url, 
                        author_username
                    ) VALUES (?, ?, ?, ?, ?)`,
                    [title, content, category, image_url, req.user.username]
                );

                res.status(201).json({
                    id: result.insertId,
                    message: 'เพิ่มข่าวเรียบร้อยแล้ว'
                });
                break;

            default:
                res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('News API Error:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดำเนินการ' });
    } finally {
        await connection.end();
    }
}

export default authMiddleware(handler);