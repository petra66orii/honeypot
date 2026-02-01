import React from "react";
import type { Order } from "../../services/types";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">
            Order #{order.order_number.substring(0, 8)}...
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* 1. Customer & Shipping Info */}
            <div>
              <h4 className="mb-3 font-semibold text-gray-900">
                📦 Shipping Details
              </h4>
              <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {order.first_name} {order.last_name}
                </p>
                <p>{order.email}</p>
                <p>{order.phone_number}</p>
                <div className="my-2 border-t border-gray-200" />
                <p>{order.street_address1}</p>
                <p>
                  {order.town}, {order.postcode}
                </p>
                <p>{order.country}</p>
              </div>
            </div>

            {/* 2. Order Summary */}
            <div>
              <h4 className="mb-3 font-semibold text-gray-900">
                💰 Payment Info
              </h4>
              <div className="rounded-md border border-gray-100 p-4 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-honey-gold">
                    {order.status}
                  </span>
                </div>
                <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold text-gray-900">
                  <span>Total:</span>
                  <span>€{order.total_price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. The Items List (The Packing List) */}
          <div className="mt-8">
            <h4 className="mb-3 font-semibold text-gray-900">🛒 Order Items</h4>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Product
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {item.product_name}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-500">
                        x{item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        €{item.product_price || "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="ml-3 rounded-md bg-honey-gold px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
          >
            Print Packing Slip
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
