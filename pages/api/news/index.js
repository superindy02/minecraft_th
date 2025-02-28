import mysql from 'mysql2/promise';
import { authMiddleware } from '../../../middleware/auth';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

export default authMiddleware(async (req, res) => {
  const connection = await pool.getConnection();
  try {
    if (req.method === 'GET') {
      const [rows] = await connection.execute(
        'SELECT * FROM news ORDER BY created_at DESC'
      );
      res.status(200).json(rows);
    } else if (req.method === 'POST') {
      const { title, content, category } = req.body;
      const [result] = await connection.execute(
        'INSERT INTO news (title, content, category, author_id) VALUES (?, ?, ?, ?)',
        [title, content, category, req.user.id]
      );
      res.status(201).json({ id: result.insertId });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
  } finally {
    connection.release();
  }
}); 