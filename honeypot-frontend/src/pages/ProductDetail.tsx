import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetProductQuery,
  useGetRelatedProductsQuery,
} from "../services/api";
import BeeRating from "../components/BeeRating";
import ProductCard from "../components/ProductCard";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const { data: product, isLoading, isError } = useGetProductQuery(id!);
  const { data: relatedProducts } = useGetRelatedProductsQuery(id!, {
    skip: !id,
  });

  if (isLoading)
    return <div className="text-center py-20">Finding the hive...</div>;
  if (isError || !product)
    return (
      <div className="text-center py-20 text-red-500">Product not found.</div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <Link
        to="/"
        className="text-gray-500 hover:text-honey-gold mb-6 inline-block"
      >
        &larr; Back to Shop
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left: Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-xl text-honey-gold font-semibold">
            €{product.price}
          </p>

          <div className="mt-4">
            <BeeRating
              fullBees={product.full_bees}
              hasHalfBee={product.has_half_bee}
              averageRating={product.average_rating}
            />
          </div>

          <p className="mt-6 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Add to Bag (Static for now) */}
          <div className="mt-8 flex gap-4">
            <button className="flex-1 rounded-full bg-honey-gold px-8 py-3 text-white font-bold hover:bg-yellow-600 transition">
              Add to Bag
            </button>
            <button className="rounded-full border border-gray-300 px-4 py-3 hover:bg-gray-50">
              ❤️
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            You might also like
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {relatedProducts.map((rel) => (
              // We link these to their own detail pages
              <Link key={rel.id} to={`/products/${rel.id}`}>
                <ProductCard product={rel} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
