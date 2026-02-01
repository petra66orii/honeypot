import React, { useState } from "react";
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../services/api";
import type { Order } from "../../services/types";
import OrderDetailsModal from "../../components/admin/OrderDetailsModal";

// Helper for Status Colors (unchanged)
const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Processing":
      return "bg-blue-100 text-blue-800";
    case "Shipped":
      return "bg-purple-100 text-purple-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AdminOrders: React.FC = () => {
  const [page, setPage] = useState(1);
  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetAdminOrdersQuery({ page });
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  // 🆕 STATE FOR MASS ACTIONS & MODAL
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const PAGE_SIZE = 12;
  const totalPages = ordersData ? Math.ceil(ordersData.count / PAGE_SIZE) : 0;

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  // Clear selection when navigating pages is handled directly in the pagination controls.

  // 1. Handle Single Checkbox Click
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const currentPageIds = ordersData?.results.map((o) => o.id) || [];

  const isAllSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id));

  // 2. Handle "Select All" (Current Page Only)
  const toggleSelectAll = () => {
    if (isAllSelected) {
      // If all are selected, clear ONLY current page IDs (keep others if you want multi-page, but for now we clear all for safety)
      setSelectedIds([]);
    } else {
      // Select all on current page
      setSelectedIds(currentPageIds);
    }
  };

  // 3. Handle Mass Update
  const handleBulkUpdate = async (newStatus: string) => {
    if (!window.confirm(`Mark ${selectedIds.length} orders as ${newStatus}?`))
      return;

    // We loop through and update them one by one (Parallel Promises)
    try {
      await Promise.all(
        selectedIds.map((id) =>
          updateStatus({ id, status: newStatus }).unwrap(),
        ),
      );
      setSelectedIds([]); // Clear selection on success
      alert("Orders updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Some updates failed.");
    }
  };

  if (isLoading)
    return <div className="p-8 text-center">Loading orders... 📦</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-500">Error loading orders.</div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Order Management 📦
        </h1>

        {/* 🆕 BULK ACTION BAR */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 animate-fade-in">
            <span className="text-sm font-medium text-blue-800">
              {selectedIds.length} Selected
            </span>
            <div className="h-4 w-px bg-blue-200 mx-2"></div>
            <span className="text-xs text-blue-600 uppercase font-bold">
              Set Status:
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => handleBulkUpdate("Processing")}
                className="px-3 py-1 bg-white border border-blue-200 rounded hover:bg-blue-100 text-xs"
              >
                Processing
              </button>
              <button
                onClick={() => handleBulkUpdate("Shipped")}
                className="px-3 py-1 bg-white border border-blue-200 rounded hover:bg-blue-100 text-xs"
              >
                Shipped
              </button>
              <button
                onClick={() => handleBulkUpdate("Delivered")}
                className="px-3 py-1 bg-white border border-blue-200 rounded hover:bg-blue-100 text-xs"
              >
                Delivered
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* CHECKBOX HEADER */}
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={isAllSelected}
                  className="rounded border-gray-300 text-honey-gold focus:ring-honey-gold"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordersData?.results.map((order: Order) => (
              <tr
                key={order.id}
                className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(order.id) ? "bg-blue-50/50" : ""}`}
              >
                {/* CHECKBOX ROW */}
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(order.id)}
                    onChange={() => toggleSelect(order.id)}
                    className="rounded border-gray-300 text-honey-gold focus:ring-honey-gold"
                  />
                </td>

                {/* ID with Truncation */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <span
                      title={
                        order.order_number
                      } /* Tooltip shows full ID on hover */
                      className="cursor-help border-b border-dotted border-gray-400"
                    >
                      #{order.order_number.substring(0, 8)}...
                    </span>

                    {/* Optional: Copy Button */}
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(order.order_number)
                      }
                      className="text-gray-400 hover:text-honey-gold transition-colors"
                      title="Copy Order ID"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.first_name} {order.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  €{order.total_price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                  {/* VIEW DETAILS BUTTON */}
                  <button
                    onClick={() => setViewOrder(order)}
                    className="text-honey-gold hover:text-yellow-600 font-medium hover:underline"
                  >
                    View
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    disabled={isUpdating}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-honey-gold focus:ring-honey-gold sm:text-sm border p-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION (Same as before) */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() =>
            setPage((p) => {
              const next = Math.max(1, p - 1);
              setSelectedIds([]);
              return next;
            })
          }
          disabled={page === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() =>
            setPage((p) => {
              const next = Math.min(totalPages, p + 1);
              setSelectedIds([]);
              return next;
            })
          }
          disabled={page === totalPages}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* 🆕 ORDER DETAILS MODAL */}
      {viewOrder && (
        <OrderDetailsModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
        />
      )}
    </div>
  );
};

export default AdminOrders;
