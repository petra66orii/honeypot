import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../services/api";

const AdminProducts: React.FC = () => {
  // 1. Setup Pagination State
  const [page, setPage] = useState(1);

  // 2. Fetch data for the SPECIFIC page
  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useGetProductsQuery(
    { category: "", page },
    {
      pollingInterval: 0,
    },
  );

  // 3. Setup Delete Mutation
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevents clicking the row (if you have row-click logic)

    if (window.confirm("Are you sure?")) {
      try {
        await deleteProduct(id).unwrap();
        // Success! The 'invalidatesTags' in api.ts will handle the refresh.
      } catch (err: unknown) {
        // Only alert if it's NOT a 404.
        // If it's 404, it's already gone, so we don't care!
        const isErrorWithStatus = (
          value: unknown,
        ): value is { status?: number } =>
          typeof value === "object" &&
          value !== null &&
          "status" in (value as Record<string, unknown>);

        if (!isErrorWithStatus(err) || err.status !== 404) {
          alert("Failed to delete product");
        }
      }
    }
  };

  // 4. Calculate Total Pages (Must match your Django PAGE_SIZE, e.g., 12)
  const PAGE_SIZE = 12;
  const totalPages = productsData
    ? Math.ceil(productsData.count / PAGE_SIZE)
    : 0;

  // Helper to disable buttons
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages || totalPages === 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <div className="p-8">Loading inventory...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products Manager</h1>
        <Link
          to="/admin/products/new"
          className="bg-honey-gold text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition shadow-sm"
        >
          + Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 relative">
        {/* Loading Overlay during page transitions */}
        {isFetching && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <div className="text-honey-gold font-bold">Refreshing...</div>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200 overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 overflow-hidden">
            {productsData?.results.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-lg">
                        🍯
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {product.category?.friendly_name ||
                      product.category?.name ||
                      "Uncategorized"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  €{product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => handleDelete(e, product.id)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {isDeleting ? "..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {productsData?.results.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found. Start by adding one!
          </div>
        )}

        {/* PAGINATION TOOLBAR */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          {/* Mobile View (Simple) */}
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={isFirstPage}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={isLastPage}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Desktop View (Full Controls) */}
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{totalPages}</span> (
                {productsData?.count || 0} total results)
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                {/* FIRST PAGE (<<) */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={isFirstPage}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="First Page"
                >
                  <span className="sr-only">First Page</span>
                  {/* Heroicon: chevron-double-left */}
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* PREVIOUS (<) */}
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={isFirstPage}
                  className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* CURRENT PAGE INDICATOR */}
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-honey-gold ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                  {page}
                </span>

                {/* NEXT (>) */}
                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, page + 1))
                  }
                  disabled={isLastPage}
                  className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* LAST PAGE (>>) */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={isLastPage}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Last Page"
                >
                  <span className="sr-only">Last Page</span>
                  {/* Heroicon: chevron-double-right */}
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
