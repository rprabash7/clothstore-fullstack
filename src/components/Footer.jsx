import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">ClothStore</h3>
            <p className="text-gray-400 text-sm">
              Your one-stop destination for trendy and comfortable clothing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link to="/products" className="hover:text-blue-400">All Products</Link></li>
              <li><Link to="/login" className="hover:text-blue-400">Login</Link></li>
              <li><Link to="/register" className="hover:text-blue-400">Register</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">Email: prabashnau@gmail.com</p>
            <p className="text-gray-400 text-sm">Phone: +91 6302111153</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          © 2026 ClothStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;