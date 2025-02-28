// ... imports ...
export default function Home() {
    const { user } = useAuth();
    const [latestNews, setLatestNews] = useState([]);
    const [featuredItems, setFeaturedItems] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [newsRes, itemsRes, postsRes] = await Promise.all([
            fetch('/api/news'),
            fetch('/api/featured-items'),
            fetch('/api/latest-posts'),
          ]);
          setLatestNews(await newsRes.json());
          setFeaturedItems(await itemsRes.json());
          setLatestPosts(await postsRes.json());
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, []);
  
    return (
      <Layout>
        <Head>
          <title>Minecraft TH - หน้าแรก</title>
        </Head>
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <p className="text-center">กำลังโหลด...</p>
          ) : (
            <>
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">ข่าวล่าสุด</h2>
                {/* ... */}
              </section>
              {/* ... อื่น ๆ คงเดิม ... */}
            </>
          )}
        </div>
      </Layout>
    );
  }