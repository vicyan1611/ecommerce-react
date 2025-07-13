import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import SortDropdown from "../components/SortDropdown";
import ProductCard from "../components/ProductCard";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_PRODUCTS, SEARCH_PRODUCTS } from "../api/queries";
import type { Product } from "../types/product";

interface Filters {
  category: string;
  priceRange: string;
  minPrice?: number;
  maxPrice?: number;
}

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    category: "",
    priceRange: "",
  });
  const [sortKey, setSortKey] = useState<string>("name");
  const [products, setProducts] = useState<Product[]>([]);

  // Query for all products (when no search term)
  const {
    loading: allProductsLoading,
    error: allProductsError,
    data: allProductsData,
  } = useQuery(GET_PRODUCTS, {
    variables: { page: 1, limit: 100 },
    skip: !!searchTerm,
  });

  // Lazy query for search (when there's a search term)
  const [
    searchProducts,
    { loading: searchLoading, error: searchError, data: searchData },
  ] = useLazyQuery(SEARCH_PRODUCTS);

  useEffect(() => {
    if (searchTerm.trim()) {
      // Use search query
      searchProducts({
        variables: {
          searchTerm: searchTerm.trim(),
          page: 1,
          limit: 100,
          categoryId: filters.category ? parseInt(filters.category) : undefined,
        },
      });
    }
  }, [searchTerm, filters.category, searchProducts]);

  useEffect(() => {
    let currentProducts: Product[] = [];

    if (searchTerm.trim()) {
      currentProducts = searchData?.searchProducts || [];
    } else {
      currentProducts = allProductsData?.products || [];
    }

    // Apply client-side filtering for price range
    if (filters.minPrice !== undefined) {
      currentProducts = currentProducts.filter(
        (p) => p.price >= filters.minPrice!
      );
    }
    if (filters.maxPrice !== undefined) {
      currentProducts = currentProducts.filter(
        (p) => p.price <= filters.maxPrice!
      );
    }

    // Apply client-side sorting
    const sortedProducts = [...currentProducts];
    switch (sortKey) {
      case "price-low":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "name":
      default:
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setProducts(sortedProducts);
  }, [allProductsData, searchData, searchTerm, filters, sortKey]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sort: string) => {
    setSortKey(sort);
  };

  const loading = searchTerm.trim() ? searchLoading : allProductsLoading;
  const error = searchTerm.trim() ? searchError : allProductsError;

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

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error loading products: {error.message}
          </div>
        )}

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
