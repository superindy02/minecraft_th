import { useState, useEffect } from "react";
import Layout from '../components/Layout';
import ForumThreadList from '../components/forum/ForumThreadList';
import CreateThread from '../components/forum/CreateThread';

const Forum = () => {
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        // โหลดข้อมูลกระทู้
        const fetchThreads = async () => {
            try {
                const response = await fetch('/api/forum/threads');
                const data = await response.json();
                setThreads(data);
            } catch (error) {
                console.error('Error loading threads:', error);
            }
        };

        fetchThreads();
    }, []);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">กระดานสนทนา</h1>
                <CreateThread />
                <ForumThreadList threads={threads} />
            </div>
        </Layout>
    );
};

export default Forum;