import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-gray-500">Total Sales</h3>
          <p className="text-3xl font-bold">€1,240.00</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <h3 className="text-gray-500">Active Orders</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-honey-gold">
          <h3 className="text-gray-500">Products</h3>
          <p className="text-3xl font-bold">43</p>
        </div>
      </div>
      {/* We will add charts or recent tables here later */}
    </div>
  );
};

export default Dashboard;
