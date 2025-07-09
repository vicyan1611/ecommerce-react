import React from "react";

interface Filters {
  category: string;
  priceRange: string;
  minPrice?: number;
  maxPrice?: number;
}

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
}) => {
  const categories = [
    { value: "", label: "All Categories" },
    { value: "Electronics", label: "Electronics" },
    { value: "Wearables", label: "Wearables" },
    { value: "Audio", label: "Audio" },
    { value: "Peripherals", label: "Peripherals" },
  ];

  const priceRanges = [
    { value: "", label: "Any Price" },
    { value: "0-100", label: "Under $100" },
    { value: "100-500", label: "$100 - $500" },
    { value: "500-1000", label: "$500 - $1000" },
    { value: "1000+", label: "Over $1000" },
  ];

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category,
    });
  };

  const handlePriceRangeChange = (priceRange: string) => {
    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    if (priceRange === "0-100") {
      minPrice = 0;
      maxPrice = 100;
    } else if (priceRange === "100-500") {
      minPrice = 100;
      maxPrice = 500;
    } else if (priceRange === "500-1000") {
      minPrice = 500;
      maxPrice = 1000;
    } else if (priceRange === "1000+") {
      minPrice = 1000;
    }

    onFilterChange({
      ...filters,
      priceRange,
      minPrice,
      maxPrice,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      category: "",
      priceRange: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.value} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.value}
                checked={filters.category === category.value}
                onChange={() => handleCategoryChange(category.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.value} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value={range.value}
                checked={filters.priceRange === range.value}
                onChange={() => handlePriceRangeChange(range.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
