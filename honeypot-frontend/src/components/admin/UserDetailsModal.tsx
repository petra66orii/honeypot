import React, { useState } from "react";
import type { User, Order } from "../../services/types";

interface UserDetailsModalProps {
  user: User;
  orders: Order[]; // We will pass these in
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  orders,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"info" | "orders" | "messages">(
    "info",
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-honey-gold/20 flex items-center justify-center text-honey-gold font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {user.username}
              </h3>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 shrink-0">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === "info" ? "border-b-2 border-honey-gold text-honey-gold" : "text-gray-500 hover:text-gray-700"}`}
          >
            👤 Profile Info
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === "orders" ? "border-b-2 border-honey-gold text-honey-gold" : "text-gray-500 hover:text-gray-700"}`}
          >
            📦 Past Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === "messages" ? "border-b-2 border-honey-gold text-honey-gold" : "text-gray-500 hover:text-gray-700"}`}
          >
            💬 Messages (0)
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB: INFO */}
          {activeTab === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-xs text-gray-500 uppercase">
                    User ID
                  </label>
                  <p className="font-medium text-gray-900">#{user.pk}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-xs text-gray-500 uppercase">
                    Role
                  </label>
                  <p className="font-medium text-gray-900">
                    {user.is_staff ? "🛡️ Admin" : "👤 Customer"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-xs text-gray-500 uppercase">
                    Date Joined
                  </label>
                  <p className="font-medium text-gray-900">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-xs text-gray-500 uppercase">
                    Last Login
                  </label>
                  <p className="font-medium text-gray-900">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No orders found for this user.
                </p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-bold text-gray-900">
                        Order #{order.order_number.substring(0, 8)}...
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()} •{" "}
                        {order.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-gray-900">
                        €{order.total_price}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: MESSAGES (Placeholder for now) */}
          {activeTab === "messages" && (
            <div className="text-center py-10 text-gray-500">
              <p>No messages found (Implementation pending backend support).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
