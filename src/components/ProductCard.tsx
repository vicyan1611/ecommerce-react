import React from "react";
import type { Product } from "../types/product";
import { getProductImageUrl } from "../types/product";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product details
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <Link to={`/products/${product.id}`} className="block">
        <div className="p-4">
          <img
            src={getProductImageUrl(product)}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md"
          />
          <h3 className="text-lg font-semibold text-gray-800">
            {product.name}
          </h3>
          <p className="mt-2 text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
