import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        console.log('Products response:', data);

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
            ? data.results
            : [];

        setProducts(productList.slice(0, 8));
      } catch (err) {
        console.error('Products fetch error:', err);
        setError(
          err?.response?.data?.detail ||
          err?.message ||
          'Unable to load products'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <section className="bg-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            New Collection 2026
          </h1>

          <p className="mb-8 text-xl">
            Trendy Shirts & Pants at Best Prices
          </p>

          <Link
            to="/products"
            className="rounded-full bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-gray-100"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Featured Products
        </h2>

        {loading && (
          <p className="py-10 text-center text-gray-600">
            Loading products...
          </p>
        )}

        {!loading && error && (
          <div className="rounded bg-red-50 p-4 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="py-10 text-center text-gray-600">
            No products found.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;