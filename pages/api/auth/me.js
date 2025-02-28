import mysql from 'mysql2/promise';
import { authMiddleware } from '../../../middleware/auth';

export default authMiddleware(async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [users] = await connection.execute(
      `SELECT 
        username,
        realname,
        role,
        email,
        regdate,
        lastlogin
      FROM authme 
      WHERE username = ?`,
      [req.user.username]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    }

    const [stats] = await connection.execute(
      `SELECT 
        (SELECT COUNT(*) FROM orders WHERE username = ?) as total_orders,
        (SELECT COUNT(*) FROM forum_threads WHERE author_username = ?) as total_threads,
        (SELECT COUNT(*) FROM forum_comments WHERE author_username = ?) as total_comments
      `,
      [req.user.username, req.user.username, req.user.username]
    );

    const user = {
      ...users[0],
      regdate: new Date(users[0].regdate * 1000).toISOString(),
      lastlogin: users[0].lastlogin ? new Date(users[0].lastlogin * 1000).toISOString() : null,
      stats: stats[0],
    };

    res.status(200).json({ user });
  } catch (error) {
    console.error('Auth Me API Error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  } finally {
    if (connection) await connection.end();
  }
});