import React from "react";
import { Link } from "react-router-dom";
import type { Product } from "../services/types";
import BeeRating from "./BeeRating";
import { useDispatch } from "react-redux";
import { addToCart } from "../services/cartSlice";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const cardImage = product.image_thumbnail || product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the Detail page when clicking the button
    dispatch(addToCart(product));
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md transition-all hover:shadow-xl">
      {/* Product Image */}
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {cardImage ? (
            <img
              src={cardImage}
              alt={product.name}
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <span className="text-xs font-medium uppercase tracking-wider text-lavender">
            {product.category.friendly_name}
          </span>
        )}
        <Link to={`/products/${product.id}`}>
          <h3 className="mt-1 text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
        </Link>

        {/* Bee Rating System */}
        <div className="mt-2">
          <BeeRating
            fullBees={product.full_bees}
            hasHalfBee={product.has_half_bee}
            averageRating={product.average_rating}
          />
        </div>

        {/* Price and Add to Bag */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-xl font-bold text-gray-900">€{product.price}</p>
          <button
            onClick={handleAddToCart} // Add the click handler
            className="rounded-full bg-honey-gold px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
