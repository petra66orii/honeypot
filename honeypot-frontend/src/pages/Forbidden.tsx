import React from "react";
import { Link } from "react-router-dom";

const Forbidden: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-red-50">
      <div className="text-9xl mb-4">👑</div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-red-900 mb-4">
        403: Queen's Chamber
      </h1>
      <p className="text-xl text-gray-700 mb-8 max-w-lg">
        Halt! Only the Queen and her Royal Guard (Admins) are allowed in here.
        Your worker bee wings cannot carry you this far.
      </p>
      <Link
        to="/"
        className="bg-red-800 text-white font-bold px-8 py-3 rounded-full hover:bg-red-900 transition shadow-lg"
      >
        Fly Back Home
      </Link>
    </div>
  );
};

export default Forbidden;
