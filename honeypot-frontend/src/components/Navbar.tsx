import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Connect to the Redux store to get the live cart count
  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity,
  );

  // Helper for active link styling
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-honey-gold font-semibold"
      : "text-gray-600 hover:text-honey-gold transition-colors";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 1. Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍯</span>
            <span className="font-serif text-2xl font-bold text-gray-900 tracking-tight">
              HoneyPot
            </span>
          </Link>

          {/* 2. Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass}>
              Shop
            </NavLink>
            <NavLink to="/gifts" className={navLinkClass}>
              Gifts & Deals
            </NavLink>
            <NavLink to="/blog" className={navLinkClass}>
              Blog
            </NavLink>
          </div>

          {/* 3. Icons (Profile & Cart) */}
          <div className="flex items-center gap-6">
            {/* Search Icon (Optional toggle could go here) */}
            <button className="text-gray-500 hover:text-honey-gold">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* User Profile */}
            <Link
              to="/profile"
              className="text-gray-500 hover:text-honey-gold hidden sm:block"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>

            {/* Shopping Bag with Badge */}
            <Link
              to="/bag"
              className="group relative text-gray-500 hover:text-honey-gold"
            >
              <svg
                className="w-6 h-6 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

              {/* The Redux Badge! Only shows if items exist */}
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-honey-gold text-xs font-bold text-white shadow-sm ring-2 ring-white">
                  {cartQuantity}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-lg">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </NavLink>
            <NavLink
              to="/gifts"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Gifts & Deals
            </NavLink>
            <NavLink
              to="/blog"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </NavLink>
            <Link
              to="/profile"
              className="text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              My Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
