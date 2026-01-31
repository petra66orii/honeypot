import React from "react";

const ServerError: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-gray-50">
      <div className="text-9xl mb-4">🌪️</div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
        500: The Hive Has Collapsed
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-lg">
        Something went wrong on our servers. The bees are in a panic. Please try
        refreshing the page or come back later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-honey-gold text-white font-bold px-8 py-3 rounded-full hover:bg-yellow-500 transition shadow-lg"
      >
        Try Refreshing
      </button>
    </div>
  );
};

export default ServerError;
