const CategoryFilter = ({ onFilter }) => {
    return (
        <div className="mb-6">
            <select 
                onChange={(e) => onFilter(e.target.value)}
                className="w-full p-2 border rounded"
            >
                <option value="all">ทั้งหมด</option>
                <option value="rank">ยศ</option>
                <option value="item">ไอเทม</option>
                <option value="cosmetic">เครื่องประดับ</option>
            </select>
        </div>
    );
};

export default CategoryFilter; 