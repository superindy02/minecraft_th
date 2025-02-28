import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function CreateThread() {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // โค้ดสำหรับสร้างกระทู้
    };

    if (!user) return null;

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">สร้างกระทู้ใหม่</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="หัวข้อกระทู้"
                    className="w-full p-2 border rounded"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="เนื้อหากระทู้"
                    rows="5"
                    className="w-full p-2 border rounded"
                />
                <button 
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    สร้างกระทู้
                </button>
            </div>
        </form>
    );
} 