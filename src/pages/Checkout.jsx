import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ఇక్కడ backend కి order submit చేయాలి
    alert('Order placed successfully!');
    clearCart();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
          
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-4 py-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-4 py-2"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border rounded px-4 py-2"
            />
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border rounded px-4 py-2"
              rows="3"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2"
              />
            </div>
            <input
              type="text"
              name="pincode"
              placeholder="PIN Code"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold mt-6 hover:bg-blue-700"
          >
            Place Order (₹{getCartTotal()})
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          {cartItems.map(item => (
            <div key={`${item.id}-${item.size}`} className="flex justify-between mb-4 pb-4 border-b">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">Size: {item.size}, Qty: {item.quantity}</p>
              </div>
              <p className="font-bold">₹{item.price * item.quantity}</p>
            </div>
          ))}
          <div className="flex justify-between text-xl font-bold mt-6 pt-4 border-t">
            <span>Total:</span>
            <span className="text-blue-600">₹{getCartTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;