import { useState, useEffect } from "react";
import Layout from '../components/Layout';
import ProductList from '../components/shop/ProductList';
import ShoppingCart from '../components/shop/ShoppingCart';
import CategoryFilter from '../components/shop/CategoryFilter';

// ... imports ...
const Shop = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      const fetchProducts = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/shop/products');
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Error loading products:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }, []);
  
    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
  
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">ร้านค้า</h1>
          {isLoading ? (
            <p className="text-center">กำลังโหลด...</p>
          ) : (
            <div className="flex gap-8">
              <div className="w-3/4">
                <CategoryFilter onFilter={setCategory} />
                <ProductList products={filteredProducts} />
              </div>
              <div className="w-1/4">
                <ShoppingCart />
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  };