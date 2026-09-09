import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          ClothStore
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/products" className="hover:text-blue-600">All Products</Link>
          <Link to="/products?category=shirts" className="hover:text-blue-600">Shirts</Link>
          <Link to="/products?category=pants" className="hover:text-blue-600">Pants</Link>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm">Hi, {user.email?.split('@')[0]}</span>
              <button onClick={logout} className="text-sm text-red-600 hover:underline">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm hover:text-blue-600">
              Login
            </Link>
          )}
          
          <Link to="/cart" className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;