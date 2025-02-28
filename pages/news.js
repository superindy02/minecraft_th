import { useState, useEffect } from "react";
import Layout from '../components/Layout';
import NewsCard from '../components/news/NewsCard';
import NewsFilter from '../components/news/NewsFilter';

const News = () => {
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/news?filter=${filter}`); // เพิ่ม filter ใน API
        if (!response.ok) throw new Error('ไม่สามารถโหลดข่าวได้');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [filter]); // เพิ่ม filter เป็น dependency

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">ข่าวสาร</h1>
        <NewsFilter onFilter={setFilter} />
        {isLoading && <p className="text-center">กำลังโหลด...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!isLoading && !error && (
          <div className="grid gap-4">
            {news.length > 0 ? (
              news.map(item => <NewsCard key={item.id} news={item} />)
            ) : (
              <p className="text-center">ไม่มีข่าวในหมวดนี้</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default News;