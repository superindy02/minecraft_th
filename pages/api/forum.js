import mysql from 'mysql2/promise';
import { authMiddleware } from '../../middleware/auth';

// กำหนดประเภทกระทู้ที่อนุญาต
const VALID_CATEGORIES = [
    'general',      // ทั่วไป
    'support',      // แจ้งปัญหา
    'introduction', // แนะนำตัว
    'event',        // กิจกรรม
    'knowledge'     // แลกเปลี่ยนความรู้
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
                const { limit = 10, page = 1, category, thread_id } = req.query;
                const offset = (page - 1) * limit;

                // ถ้ามี thread_id ให้ดึงข้อมูลกระทู้และความคิดเห็น
                if (thread_id) {
                    // ดึงข้อมูลกระทู้
                    const [threads] = await connection.execute(
                        `SELECT 
                            t.*,
                            a.realname as author_name
                        FROM forum_threads t
                        LEFT JOIN authme a ON t.author_username = a.username
                        WHERE t.id = ?`,
                        [thread_id]
                    );

                    if (threads.length === 0) {
                        return res.status(404).json({ error: 'ไม่พบกระทู้' });
                    }

                    // ดึงความคิดเห็น
                    const [comments] = await connection.execute(
                        `SELECT 
                            c.*,
                            a.realname as author_name
                        FROM forum_comments c
                        LEFT JOIN authme a ON c.author_username = a.username
                        WHERE c.thread_id = ?
                        ORDER BY c.created_at ASC`,
                        [thread_id]
                    );

                    // อัพเดทจำนวนการเข้าชม
                    await connection.execute(
                        'UPDATE forum_threads SET view_count = view_count + 1 WHERE id = ?',
                        [thread_id]
                    );

                    return res.status(200).json({
                        thread: threads[0],
                        comments
                    });
                }

                // ตรวจสอบความถูกต้องของ category
                if (category && !VALID_CATEGORIES.includes(category)) {
                    return res.status(400).json({
                        error: 'ประเภทกระทู้ไม่ถูกต้อง',
                        validCategories: VALID_CATEGORIES
                    });
                }

                // ดึงรายการกระทู้
                let query = `
                    SELECT 
                        t.*,
                        a.realname as author_name,
                        (SELECT COUNT(*) FROM forum_comments WHERE thread_id = t.id) as comment_count
                    FROM forum_threads t
                    LEFT JOIN authme a ON t.author_username = a.username
                `;

                const queryParams = [];

                if (category) {
                    query += ' WHERE t.category = ?';
                    queryParams.push(category);
                }

                // แสดงกระทู้ปักหมุดก่อน
                query += ' ORDER BY t.is_pinned DESC, t.created_at DESC LIMIT ? OFFSET ?';
                queryParams.push(Number(limit), Number(offset));

                const [threads] = await connection.execute(query, queryParams);

                // นับจำนวนกระทู้ทั้งหมด
                const [countResult] = await connection.execute(
                    'SELECT COUNT(*) as total FROM forum_threads' +
                    (category ? ' WHERE category = ?' : ''),
                    category ? [category] : []
                );

                res.status(200).json({
                    threads,
                    pagination: {
                        total: countResult[0].total,
                        page: Number(page),
                        limit: Number(limit),
                        totalPages: Math.ceil(countResult[0].total / limit)
                    }
                });
                break;

            case 'POST':
                // สร้างกระทู้ใหม่หรือเพิ่มความคิดเห็น
                const { title, content, category: newCategory, thread_id: commentThreadId } = req.body;

                // ถ้ามี commentThreadId แสดงว่าเป็นการเพิ่มความคิดเห็น
                if (commentThreadId) {
                    if (!content) {
                        return res.status(400).json({ error: 'กรุณากรอกเนื้อหาความคิดเห็น' });
                    }

                    // ตรวจสอบว่ากระทู้มีอยู่จริงและไม่ถูกล็อก
                    const [threadCheck] = await connection.execute(
                        'SELECT is_locked FROM forum_threads WHERE id = ?',
                        [commentThreadId]
                    );

                    if (threadCheck.length === 0) {
                        return res.status(404).json({ error: 'ไม่พบกระทู้' });
                    }

                    if (threadCheck[0].is_locked) {
                        return res.status(403).json({ error: 'กระทู้นี้ถูกล็อกแล้ว' });
                    }

                    const [commentResult] = await connection.execute(
                        `INSERT INTO forum_comments (
                            thread_id,
                            author_username,
                            content
                        ) VALUES (?, ?, ?)`,
                        [commentThreadId, req.user.username, content]
                    );

                    res.status(201).json({
                        id: commentResult.insertId,
                        message: 'เพิ่มความคิดเห็นเรียบร้อยแล้ว'
                    });
                } else {
                    // สร้างกระทู้ใหม่
                    if (!title || !content || !newCategory) {
                        return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
                    }

                    if (!VALID_CATEGORIES.includes(newCategory)) {
                        return res.status(400).json({
                            error: 'ประเภทกระทู้ไม่ถูกต้อง',
                            validCategories: VALID_CATEGORIES
                        });
                    }

                    const [threadResult] = await connection.execute(
                        `INSERT INTO forum_threads (
                            title,
                            content,
                            category,
                            author_username
                        ) VALUES (?, ?, ?, ?)`,
                        [title, content, newCategory, req.user.username]
                    );

                    res.status(201).json({
                        id: threadResult.insertId,
                        message: 'สร้างกระทู้เรียบร้อยแล้ว'
                    });
                }
                break;

            case 'PUT':
                // อัพเดทกระทู้ (สำหรับเจ้าของกระทู้หรือ admin)
                const { thread_id: updateThreadId, is_pinned, is_locked, ...updateData } = req.body;

                if (!updateThreadId) {
                    return res.status(400).json({ error: 'กรุณาระบุ ID กระทู้ที่ต้องการแก้ไข' });
                }

                // ตรวจสอบสิทธิ์
                const [threadOwner] = await connection.execute(
                    'SELECT author_username FROM forum_threads WHERE id = ?',
                    [updateThreadId]
                );

                if (threadOwner.length === 0) {
                    return res.status(404).json({ error: 'ไม่พบกระทู้' });
                }

                if (req.user.role !== 'admin' && threadOwner[0].author_username !== req.user.username) {
                    return res.status(403).json({ error: 'ไม่มีสิทธิ์ในการแก้ไขกระทู้นี้' });
                }

                // admin เท่านั้นที่สามารถปักหมุดหรือล็อกกระทู้ได้
                if ((is_pinned !== undefined || is_locked !== undefined) && req.user.role !== 'admin') {
                    return res.status(403).json({ error: 'ไม่มีสิทธิ์ในการดำเนินการนี้' });
                }

                const updateFields = [];
                const updateValues = [];

                // อัพเดทข้อมูลทั่วไป
                Object.entries(updateData).forEach(([key, value]) => {
                    if (['title', 'content', 'category'].includes(key)) {
                        updateFields.push(`${key} = ?`);
                        updateValues.push(value);
                    }
                });

                // อัพเดทสถานะปักหมุดและล็อกกระทู้
                if (req.user.role === 'admin') {
                    if (is_pinned !== undefined) {
                        updateFields.push('is_pinned = ?');
                        updateValues.push(is_pinned);
                    }
                    if (is_locked !== undefined) {
                        updateFields.push('is_locked = ?');
                        updateValues.push(is_locked);
                    }
                }

                if (updateFields.length > 0) {
                    updateValues.push(updateThreadId);
                    await connection.execute(
                        `UPDATE forum_threads 
                        SET ${updateFields.join(', ')}, 
                        updated_at = CURRENT_TIMESTAMP 
                        WHERE id = ?`,
                        updateValues
                    );
                }

                res.status(200).json({ message: 'อัพเดทกระทู้เรียบร้อยแล้ว' });
                break;

            default:
                res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Forum API Error:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดำเนินการ' });
    } finally {
        await connection.end();
    }
}

export default authMiddleware(handler);