import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-xl">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image || '/placeholder.jpg'}
          alt={product.name}
          className="h-64 w-full object-cover"
        />
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="mb-2 text-lg font-semibold hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <p className="mb-2 text-sm capitalize text-gray-600">
          {product.category}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            ₹{product.price}
          </span>

          <Link
            to={`/product/${product.id}`}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;