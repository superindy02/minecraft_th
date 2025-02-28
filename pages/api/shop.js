import mysql from 'mysql2/promise';
import { authMiddleware } from '../../middleware/auth';

// กำหนดประเภทสินค้าที่อนุญาต
const VALID_CATEGORIES = [
    'item',         // ไอเทมในเกม
    'rank',         // ยศ
    'cosmetic',     // ไอเทมตกแต่ง
    'special'       // ไอเทมพิเศษ
];

async function handler(req, res) {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        switch (req.method) {
            case 'GET':
                // ดึงพารามิเตอร์จาก query string
                const { limit = 10, page = 1, category } = req.query;
                const offset = (page - 1) * limit;

                // ตรวจสอบความถูกต้องของ category
                if (category && !VALID_CATEGORIES.includes(category)) {
                    return res.status(400).json({
                        error: 'ประเภทสินค้าไม่ถูกต้อง',
                        validCategories: VALID_CATEGORIES
                    });
                }

                // สร้าง query พื้นฐาน
                let query = `
                    SELECT 
                        p.*,
                        c.name as category_name
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE p.is_active = 1
                `;

                const queryParams = [];

                // เพิ่มเงื่อนไขหมวดหมู่ถ้ามีการระบุ
                if (category) {
                    query += ' AND p.category = ?';
                    queryParams.push(category);
                }

                // เพิ่มการเรียงลำดับและการแบ่งหน้า
                query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
                queryParams.push(Number(limit), Number(offset));

                const [products] = await connection.execute(query, queryParams);

                // ดึงจำนวนสินค้าทั้งหมด
                const [countResult] = await connection.execute(
                    'SELECT COUNT(*) as total FROM products WHERE is_active = 1' +
                    (category ? ' AND category = ?' : ''),
                    category ? [category] : []
                );

                res.status(200).json({
                    products,
                    pagination: {
                        total: countResult[0].total,
                        page: Number(page),
                        limit: Number(limit),
                        totalPages: Math.ceil(countResult[0].total / limit)
                    }
                });
                break;

            // ... โค้ดส่วนอื่นๆ ...
        }
    } catch (error) {
        console.error('Shop API Error:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดำเนินการ' });
    } finally {
        await connection.end();
    }
}

export default authMiddleware(handler);