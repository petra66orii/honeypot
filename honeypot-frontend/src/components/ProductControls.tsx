import React from "react";
import { useGetCategoriesQuery } from "../services/api";

interface ProductControlsProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
}

interface Category {
  id: number;
  name: string;
  friendly_name: string;
}

const ProductControls: React.FC<ProductControlsProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
}) => {
  // Fetch categories dynamically from Django for the dropdown!
  const { data: categories } = useGetCategoriesQuery();

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-lg bg-white p-4 shadow-sm border border-gray-100">
      {/* Search Bar */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search for honey, beeswax, deals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-honey-gold focus:outline-none focus:ring-1 focus:ring-honey-gold"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2 bg-white focus:border-honey-gold focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories?.map((cat: Category) => (
            <option key={cat.id} value={cat.name}>
              {cat.friendly_name}
            </option>
          ))}
        </select>

        {/* Sort Dropdown */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2 bg-white focus:border-honey-gold focus:outline-none"
        >
          <option value="">Sort By: Default</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-rating">Highest Rated</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>
    </div>
  );
};

export default ProductControls;
