import { getImageUrl, getProduct } from '../services/api';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error('Product loading error:', err);
        setError('Unable to load product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);

    if (Number.isNaN(value) || value < 1) {
      setQuantity(1);
      return;
    }

    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!product || addingToCart) return;

    setAddingToCart(true);
    setError('');

    try {
      await addToCart(product, quantity, selectedSize);
      navigate('/cart');
    } catch (err) {
      console.error('Add to cart error:', err);
      setError('Failed to add product to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="py-10 text-center">Loading...</div>;
  }

  if (error && !product) {
    return <div className="py-10 text-center text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="py-10 text-center">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <img
  src={getImageUrl(product.image)}
  alt={product.name}
  className="w-full rounded-lg object-cover shadow-md"
/>
        </div>

        <div>
          <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>

          <p className="mb-4 text-gray-600">
            {product.description}
          </p>

          <p className="mb-6 text-2xl font-bold text-blue-600">
            ₹{product.price}
          </p>

          <div className="mb-6">
            <label className="mb-2 block font-semibold">
              Size:
            </label>

            <div className="flex gap-2">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded border px-4 py-2 ${
                    selectedSize === size
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'hover:border-blue-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="quantity"
              className="mb-2 block font-semibold"
            >
              Quantity:
            </label>

            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock || 999}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-24 rounded border px-4 py-2"
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600">{error}</p>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;  
