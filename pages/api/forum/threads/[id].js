export default function handler(req, res) {
    const { id } = req.query;

    // Mock data สำหรับรายละเอียดกระทู้
    const threadDetails = {
        1: {
            id: 1,
            title: "แนะนำตัวครับ! ผู้เล่นใหม่จากเชียงใหม่",
            author: "Steve_CMI",
            date: "2023-12-25",
            content: `สวัสดีครับทุกคน!

            ผมเพิ่งเริ่มเล่นในเซิร์ฟนี้ได้ไม่นาน ตอนนี้กำลังสร้างบ้านอยู่แถวๆ สปอนครับ
            ใครอยู่แถวนั้นทักได้เลยนะครับ ยินดีที่ได้รู้จักครับ!

            - Steve_CMI`,
        },
        // เพิ่มกระทู้อื่นๆ ตามต้องการ
    };

    const thread = threadDetails[id];

    if (thread) {
        res.status(200).json(thread);
    } else {
        res.status(404).json({ message: 'ไม่พบกระทู้ที่ต้องการ' });
    }
} 