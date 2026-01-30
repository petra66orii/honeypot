import React from "react";
import { useGetTestimonialsQuery } from "../services/api";

const Testimonials: React.FC = () => {
  const { data: testimonials, isLoading } = useGetTestimonialsQuery();

  if (isLoading || !testimonials?.length) return null;

  return (
    <div className="bg-yellow-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
          What Our Hive Says 🐝
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100"
            >
              <div className="flex justify-center mb-4 text-yellow-400">
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </div>
              <p className="text-gray-600 italic mb-4">"{t.text}"</p>
              <h4 className="font-bold text-gray-900">- {t.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
