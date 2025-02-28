export default function NewsFilter({ onFilter }) {
    return (
        <div className="mb-6">
            <select 
                onChange={(e) => onFilter(e.target.value)}
                className="w-full p-2 border rounded"
            >
                <option value="all">ทั้งหมด</option>
                <option value="update">อัพเดทเซิร์ฟเวอร์</option>
                <option value="event">กิจกรรม</option>
                <option value="announcement">ประกาศ</option>
            </select>
        </div>
    );
} 