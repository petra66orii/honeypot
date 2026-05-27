import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-yellow-50/30">
      <div className="text-9xl mb-4">🍯</div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
        404: Empty Jar!
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-lg">
        Oh bother! The page you're looking for seems to have buzzed off. It
        might have been moved, deleted, or never existed.
      </p>

      <div className="flex gap-4">
        <Link
          to="/"
          className="bg-honey-gold text-white font-bold px-8 py-3 rounded-full hover:bg-yellow-500 transition shadow-lg"
        >
          Return Home
        </Link>
        <Link
          to="/shop"
          className="bg-white text-gray-900 font-bold px-8 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition shadow-sm"
        >
          Go Shopping
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
