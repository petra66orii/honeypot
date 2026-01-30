import React from "react";
import { Link } from "react-router-dom";
// FIX: Import the new hook
import { useGetDealsQuery } from "../services/api";

const GiftsDeals: React.FC = () => {
  // FIX: Use the deals query directly. It returns exactly what we want.
  const { data: dealProducts, isLoading } = useGetDealsQuery();

  if (isLoading)
    return <div className="text-center py-20">Loading deals...</div>;

  return (
    <div className="bg-white">
      <div className="bg-honey-gold/10 py-16 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Gifts & Exclusive Deals
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Sweet bundles and golden offers you can't miss.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {dealProducts && dealProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dealProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group block"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                  {/* Image handling */}
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-64 w-full object-cover object-center group-hover:opacity-75 transition"
                    />
                  ) : (
                    <div className="h-64 w-full flex items-center justify-center text-4xl bg-yellow-50">
                      🎁
                    </div>
                  )}

                  {/* Sale Badge Logic */}
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                    {product.category.friendly_name}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-lg font-medium text-honey-gold">
                  €{product.price}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              No active deals right now. Check back soon!
            </p>
            <Link
              to="/products"
              className="text-honey-gold font-bold hover:underline mt-4 inline-block"
            >
              Browse all products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftsDeals;
