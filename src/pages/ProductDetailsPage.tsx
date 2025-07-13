import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../api/queries";
import type { Product } from "../types/product";
import { getProductImageUrl } from "../types/product";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState<number>(1);
  const dispatch = useAppDispatch();

  const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: parseInt(id || "0") },
    skip: !id,
  });

  const handleAddToCart = () => {
    if (data?.product) {
      dispatch(addToCart({ ...data.product, quantity }));
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {error ? `Error: ${error.message}` : "Product not found."}
            </p>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
            >
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const product: Product = data.product;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <nav className="mb-8">
          <Link to="/products" className="text-blue-600 hover:text-blue-800">
            ← Back to Products
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={getProductImageUrl(product)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            {product.category && (
              <p className="text-sm text-gray-600 mb-4">
                Category: {product.category.name}
              </p>
            )}
            <p className="text-4xl font-bold text-gray-900 mb-8">
              ${product.price.toFixed(2)}
            </p>

            {/* Stock Information */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                In Stock: {product.inventory_count} available
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[...Array(Math.min(10, product.inventory_count))].map(
                  (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.inventory_count === 0}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 mb-4 ${
                product.inventory_count === 0
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {product.inventory_count === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            {/* Product Description */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description ||
                  `This is a high-quality ${product.name.toLowerCase()} ${
                    product.category
                      ? `from the ${product.category.name} category`
                      : ""
                  }. Perfect for those who appreciate excellent craftsmanship and reliable performance. This product offers great value for money and comes with our satisfaction guarantee.`}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
