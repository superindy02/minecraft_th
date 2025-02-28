import Layout from '../../../components/Layout';
import { useAuth } from '../../../hooks/useAuth';
import { useState } from 'react';

export default function Thread1() {
    const { user } = useAuth();
    const [comment, setComment] = useState('');

    const thread = {
        id: 1,
        title: "แนะนำตัวครับ! ผู้เล่นใหม่จากเชียงใหม่",
        author: "Steve123",
        date: "2024-01-15",
        content: "สวัสดีครับทุกคน! ผมเพิ่งเริ่มเล่นในเซิร์ฟนี้ มาจากเชียงใหม่ครับ ยินดีที่ได้รู้จักทุกคน!",
        comments: [
            {
                author: "Alex456",
                content: "ยินดีต้อนรับครับ!",
                date: "2024-01-15"
            }
        ]
    };

    const handleComment = (e) => {
        e.preventDefault();
        // โค้ดสำหรับส่งความคิดเห็น
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-4xl font-bold mb-4">{thread.title}</h1>
                    <div className="flex items-center space-x-4 mb-6">
                        <img 
                            src={`https://mc-heads.net/avatar/${thread.author}`}
                            alt={thread.author}
                            className="w-8 h-8"
                        />
                        <span>โดย {thread.author}</span>
                        <span className="text-gray-500">{thread.date}</span>
                    </div>
                    <div className="prose max-w-none mb-8">
                        {thread.content}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-2xl font-bold mb-4">ความคิดเห็น</h3>
                        {thread.comments.map((comment, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded mb-4">
                                <div className="flex items-center space-x-4 mb-2">
                                    <img 
                                        src={`https://mc-heads.net/avatar/${comment.author}`}
                                        alt={comment.author}
                                        className="w-6 h-6"
                                    />
                                    <span>{comment.author}</span>
                                    <span className="text-gray-500">{comment.date}</span>
                                </div>
                                <p>{comment.content}</p>
                            </div>
                        ))}

                        {user && (
                            <form onSubmit={handleComment} className="mt-4">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="แสดงความคิดเห็น..."
                                    rows="3"
                                />
                                <button 
                                    type="submit"
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    ส่งความคิดเห็น
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
} 