import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import SortDropdown from "../components/SortDropdown";
import ProductCard from "../components/ProductCard";
import { fetchProducts, type Product } from "../api/mock";

interface Filters {
  category: string;
  priceRange: string;
  minPrice?: number;
  maxPrice?: number;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    category: "",
    priceRange: "",
  });
  const [sortKey, setSortKey] = useState<string>("name");

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await fetchProducts({
          search: searchTerm,
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sort: sortKey,
        });
        setProducts(allProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [searchTerm, filters, sortKey]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sort: string) => {
    setSortKey(sort);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Product Catalog
          </h1>
          <SearchBar onSearch={handleSearch} searchTerm={searchTerm} />
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort and Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {loading ? "Loading..." : `${products.length} products found`}
              </p>
              <SortDropdown sortKey={sortKey} onSortChange={handleSortChange} />
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No products found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
