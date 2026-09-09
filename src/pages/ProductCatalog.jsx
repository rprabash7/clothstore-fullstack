import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const ProductCatalog = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const filtered = category === 'all' 
          ? data 
          : data.filter(p => p.category.toLowerCase() === category.toLowerCase());
        setProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {category === 'all' ? 'All Products' : `${category.charAt(0).toUpperCase() + category.slice(1)}`}
      </h1>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setCategory('all')}
          className={`px-4 py-2 rounded ${category === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setCategory('shirts')}
          className={`px-4 py-2 rounded ${category === 'shirts' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Shirts
        </button>
        <button
          onClick={() => setCategory('pants')}
          className={`px-4 py-2 rounded ${category === 'pants' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Pants
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          No products available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;