import Link from 'next/link';

const ForumThreadList = ({ threads }) => {
    return (
        <div>
            {threads && threads.map(thread => (
                <Link key={thread.id} href={`/forum/thread/thread${thread.id}`}>
                    <div className="thread-item">
                        {thread.title}
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ForumThreadList; 