import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-honey-gold text-white"
      : "text-gray-600 hover:bg-yellow-50";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-md shrink-0 hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel 🛡️</h2>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            to="/admin"
            className={`block px-4 py-3 rounded-lg font-medium transition ${isActive("/admin")}`}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/admin/products"
            className={`block px-4 py-3 rounded-lg font-medium transition ${isActive("/admin/products")}`}
          >
            🍯 Products
          </Link>
          <Link
            to="/admin/orders"
            className={`block px-4 py-3 rounded-lg font-medium transition ${isActive("/admin/orders")}`}
          >
            📦 Orders
          </Link>
          <Link
            to="/admin/users"
            className={`block px-4 py-3 rounded-lg font-medium transition ${isActive("/admin/users")}`}
          >
            👥 Users
          </Link>
          <Link
            to="/admin/content"
            className={`block px-4 py-3 rounded-lg font-medium transition ${isActive("/admin/content")}`}
          >
            🛡️ Content
          </Link>
          <Link
            to="/"
            className="block px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 mt-8"
          >
            ← Back to Site
          </Link>
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
