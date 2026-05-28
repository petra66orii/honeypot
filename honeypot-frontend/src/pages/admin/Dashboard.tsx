import React from "react";
import { Link } from "react-router-dom";
import { useGetDashboardStatsQuery } from "../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  if (isLoading)
    return <div className="p-10 text-center">Loading Dashboard... 🚀</div>;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-800">
        Admin Dashboard 📊
      </h1>

      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Revenue Card */}
        <Link
          to="/admin/orders"
          className="block rounded-lg bg-white p-6 shadow border border-gray-100 transition hover:-translate-y-0.5 hover:border-honey-gold hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-honey-gold focus-visible:ring-offset-2"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="mt-2 text-2xl lg:text-3xl font-bold text-gray-900">
                €{stats?.total_revenue?.toFixed(2)}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600 text-2xl">
              💰
            </div>
          </div>
        </Link>

        {/* Orders Card */}
        <Link
          to="/admin/orders"
          className="block rounded-lg bg-white p-6 shadow border border-gray-100 transition hover:-translate-y-0.5 hover:border-honey-gold hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-honey-gold focus-visible:ring-offset-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.total_orders}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-blue-600 text-2xl">
              📦
            </div>
          </div>
        </Link>

        {/* Products Card */}
        <Link
          to="/admin/products"
          className="block rounded-lg bg-white p-6 shadow border border-gray-100 transition hover:-translate-y-0.5 hover:border-honey-gold hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-honey-gold focus-visible:ring-offset-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Products</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.total_products}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 text-yellow-600 text-2xl">
              🍯
            </div>
          </div>
        </Link>

        {/* Users Card */}
        <Link
          to="/admin/users"
          className="block rounded-lg bg-white p-6 shadow border border-gray-100 transition hover:-translate-y-0.5 hover:border-honey-gold hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-honey-gold focus-visible:ring-offset-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.total_users}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 text-purple-600 text-2xl">
              👥
            </div>
          </div>
        </Link>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* CHART SECTION */}
        <div className="rounded-lg bg-white p-6 shadow border border-gray-100 min-w-0">
          <h3 className="mb-4 text-lg font-bold text-gray-800">
            Sales Last 7 Days
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={stats?.daily_sales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickFormatter={(val) =>
                    new Date(val).toLocaleDateString(undefined, {
                      weekday: "short",
                    })
                  }
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => `€${value}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number | undefined) => [
                    value !== undefined ? `€${value.toFixed(2)}` : "",
                    "Revenue",
                  ]}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString()
                  }
                />
                <Bar
                  dataKey="sales"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ORDERS LIST */}
        <div className="rounded-lg bg-white p-6 shadow border border-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
            <Link
              to="/admin/orders"
              className="text-sm font-medium text-honey-gold hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {stats?.recent_orders.map((order) => (
                <li key={order.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        Order #{order.order_number?.substring(0, 8)}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {order.email}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-sm font-bold text-gray-900">
                      €{order.total_price}
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                            ${
                              order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "Shipped"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
