import mysql from 'mysql2/promise';
import { authMiddleware } from '../../middleware/auth';

async function handler(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    switch (req.method) {
      case 'GET':
        const { limit = 10, page = 1 } = req.query;
        const offset = Math.max((page - 1) * limit, 0); // ป้องกัน offset ติดลบ

        let query = `
          SELECT 
            o.*,
            p.name as product_name,
            p.price as unit_price,
            a.realname as username
          FROM orders o
          LEFT JOIN products p ON o.product_id = p.id
          LEFT JOIN authme a ON o.username = a.username
        `;
        const queryParams = [];

        if (req.user.role !== 'admin') {
          query += ' WHERE o.username = ?';
          queryParams.push(req.user.username);
        }

        query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(Number(limit), Number(offset));

        const [orders] = await connection.execute(query, queryParams);
        const [countResult] = await connection.execute(
          'SELECT COUNT(*) as total FROM orders' + (req.user.role !== 'admin' ? ' WHERE username = ?' : ''),
          req.user.role !== 'admin' ? [req.user.username] : []
        );

        res.status(200).json({
          orders,
          pagination: {
            total: countResult[0].total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(countResult[0].total / limit),
          },
        });
        break;

      case 'POST':
        const { product_id, quantity } = req.body;
        if (!product_id || !quantity || quantity <= 0) {
          return res.status(400).json({ error: 'ข้อมูลไม่ถูกต้อง' });
        }
        // ... transaction เดิม ...
        break;

      case 'PUT':
        if (req.user.role !== 'admin') {
          return res.status(403).json({ error: 'ไม่มีสิทธิ์' });
        }
        // ... เดิม ...
        break;

      default:
        res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Orders API Error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดำเนินการ' });
  } finally {
    if (connection) await connection.end();
  }
}

export default authMiddleware(handler);