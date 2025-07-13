import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../api/queries";
import type { Product } from "../types/product";

const HomePage: React.FC = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { limit: 8, page: 1 },
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">
              Error loading products: {error.message}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const products: Product[] = data?.products || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Featured Products
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Check out our most popular items
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
