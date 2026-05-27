import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { removeFromCart, updateQuantity } from "../services/cartSlice";
import { useGetProductsQuery } from "../services/api";
import ProductCard from "../components/ProductCard";

const ShoppingBag: React.FC = () => {
  const dispatch = useDispatch();

  // 1. Get Cart Data from Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);

  // 2. Fetch suggestions (Fix: include required category and page)
  const { data: suggestionsData } = useGetProductsQuery({
    category: "",
    page: 1,
  });

  // Helper to handle quantity changes
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 text-6xl">🍯</div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Your bag is empty
        </h2>
        <p className="mb-8 text-gray-500">
          Looks like you haven't added any sweetness yet.
        </p>
        <Link
          to="/products"
          className="rounded-full bg-honey-gold px-8 py-3 font-semibold text-white transition hover:bg-yellow-600"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Bag</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* LEFT COLUMN: Cart Items */}
        <div className="lg:col-span-8">
          <div className="border-t border-gray-200">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex py-6 sm:py-10 border-b border-gray-100"
              >
                {/* Image */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200 sm:h-32 sm:w-32">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-50 text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <Link
                            to={`/products/${item.id}`}
                            className="font-medium text-gray-700 hover:text-honey-gold"
                          >
                            {item.name}
                          </Link>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        €{item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="absolute right-0 top-0 text-gray-400 hover:text-red-500 sm:static sm:mt-4"
                      >
                        <span className="sr-only">Remove</span>
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">
                  Order total
                </div>
                <div className="text-base font-medium text-gray-900">
                  €{totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/checkout"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-honey-gold px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-yellow-600"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* "YOU MIGHT ALSO LIKE" SECTION */}
      <div className="mt-24 border-t border-gray-100 pt-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">
          You might also like
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {/* Fix: Access .results first, then slice */}
          {suggestionsData?.results.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingBag;
