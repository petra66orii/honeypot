import React, { useState } from "react";
import { useGetProductsQuery } from "../services/api";
import ProductCard from "./ProductCard";
import ProductControls from "./ProductControls";

const ProductGrid: React.FC = () => {
  // 1. State for our filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  // 2. Pass filters to Redux.
  // Redux will automatically re-fetch whenever these values change!
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery({
    search: search || undefined,
    category__name: category || undefined,
    ordering: sort || undefined,
  });

  if (isLoading)
    return (
      <div className="text-center py-10">Loading the sweetest honey...</div>
    );
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load products.
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Our Raw & Organic Selection
      </h2>

      {/* 3. Render the Controls */}
      <ProductControls
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
      />

      {/* 4. Render the Filtered Products */}
      {products?.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
