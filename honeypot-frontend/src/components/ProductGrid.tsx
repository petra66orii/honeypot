import React, { useEffect, useState } from "react";
import { useGetProductsQuery } from "../services/api";
import ProductCard from "./ProductCard";
import ProductControls from "./ProductControls";

const ProductGrid: React.FC = () => {
  // 1. State for filters AND Page
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1); // <--- NEW: Track current page

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  // 2. Helper to handle page changes + Scroll to top
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. Reset page to 1 if user searches or filters
  // (Optional but recommended UX: if I search "Honey", I want to start at page 1)
  const handleFilterChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    setter(value);
    setPage(1);
  };

  // 4. Pass filters to Redux
  const {
    data: productsData, // Rename to 'productsData' because it's the whole box now
    isLoading,
    isError,
    isFetching, // Good to know if we are reloading between pages
  } = useGetProductsQuery({
    search: debouncedSearch,
    category: category, // Ensure a string is always passed to match the API types
    ordering: sort,
    page: page, // FIX: Pass the page number
  });

  // 5. Calculate Total Pages (Assuming Page Size is 12 in Django)
  const PAGE_SIZE = 12;
  const totalPages = productsData
    ? Math.ceil(productsData.count / PAGE_SIZE)
    : 1;

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

      {/* Render Controls */}
      <ProductControls
        search={search}
        setSearch={(val) => handleFilterChange(setSearch, val)} // Reset page on change
        category={category}
        setCategory={(val) => handleFilterChange(setCategory, val)}
        sort={sort}
        setSort={(val) => handleFilterChange(setSort, val)}
      />

      {/* Render Filtered Products */}
      {/* NOTICE: We check productsData.results now! */}
      {!productsData?.results.length ? (
        <div className="text-center py-10 text-gray-500">
          No products match your search.
        </div>
      ) : (
        <>
          {/* The Grid */}
          <div
            className={`grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${isFetching ? "opacity-50" : ""}`}
          >
            {productsData.results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* --- PAGINATION CONTROLS --- */}
          {productsData.count > PAGE_SIZE && (
            <div className="mt-12 flex justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={!productsData.previous}
                className={`px-4 py-2 rounded-md font-bold border transition ${
                  !productsData.previous
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-honey-gold border-honey-gold hover:bg-yellow-50"
                }`}
              >
                ← Previous
              </button>

              <span className="text-gray-600 font-medium">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={!productsData.next}
                className={`px-4 py-2 rounded-md font-bold border transition ${
                  !productsData.next
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-honey-gold border-honey-gold hover:bg-yellow-50"
                }`}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
