import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const adminNavItems = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/content", label: "Content" },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const isActivePath = (path: string, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const navLinkClass = (path: string, exact = false) =>
    isActivePath(path, exact)
      ? "bg-honey-gold text-white"
      : "text-gray-600 hover:bg-yellow-50 hover:text-gray-900";

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      {/* Desktop admin navigation */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white shadow-sm md:sticky md:top-16 md:block md:h-[calc(100vh-4rem)]">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="space-y-2 p-4" aria-label="Admin navigation">
          {adminNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block rounded-lg px-4 py-3 font-medium transition ${navLinkClass(item.to, item.exact)}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/"
            className="mt-8 block rounded-lg px-4 py-3 font-medium text-red-600 hover:bg-red-50"
          >
            Back to site
          </Link>
        </nav>
      </aside>

      {/* Mobile admin navigation */}
      <div className="sticky top-16 z-30 border-b border-gray-200 bg-white shadow-sm md:hidden">
        <div className="px-4 pt-4">
          <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav
          className="flex gap-2 overflow-x-auto px-4 py-3"
          aria-label="Admin navigation"
        >
          {adminNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${navLinkClass(item.to, item.exact)}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/"
            className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Site
          </Link>
        </nav>
      </div>

      {/* Main admin content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
