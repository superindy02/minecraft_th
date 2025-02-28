import Link from 'next/link';

const NewsCard = ({ news }) => {
    return (
        <Link href={`/news/news${news.id}`}>
            <div className="news-card">
                {news.title}
            </div>
        </Link>
    );
};

export default NewsCard; 