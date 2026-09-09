import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const DJANGO_BASE_URL = 'http://127.0.0.1:8000';

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/placeholder.jpg';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  return `${DJANGO_BASE_URL}${imagePath}`;
};

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    loading,
  } = useCart();

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="py-16 text-center">
        Loading cart...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-2xl font-bold">
          Your cart is empty
        </h2>

        <Link
          to="/products"
          className="text-blue-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {cartItems.map((item) => {
            const product = item.product;
            const itemTotal = Number(product.price) * item.quantity;
            const imageUrl = getImageUrl(product.image);

            return (
              <div
                key={item.id}
                className="mb-4 flex items-center gap-4 rounded bg-white p-4 shadow"
              >
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="h-24 w-24 rounded object-cover"
                  onError={(event) => {
                    event.currentTarget.src = '/placeholder.jpg';
                  }}
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600">
                    Size: {item.size}
                  </p>

                  <p className="font-bold text-blue-600">
                    ₹{product.price}
                  </p>

                  <p className="text-sm text-gray-700">
                    Item total: ₹{itemTotal.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    className="rounded bg-gray-200 px-3 py-1 text-lg hover:bg-gray-300"
                  >
                    -
                  </button>

                  <span className="min-w-8 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    className="rounded bg-gray-200 px-3 py-1 text-lg hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <div className="h-fit rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            Order Summary
          </h2>

          <div className="mb-4 flex justify-between">
            <span>Subtotal:</span>
            <span className="font-bold">
              ₹{getCartTotal().toFixed(2)}
            </span>
          </div>

          <div className="mb-4 flex justify-between">
            <span>Shipping:</span>
            <span className="text-green-600">Free</span>
          </div>

          <div className="mb-6 flex justify-between border-t pt-4">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-xl font-bold text-blue-600">
              ₹{getCartTotal().toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="w-full rounded bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;