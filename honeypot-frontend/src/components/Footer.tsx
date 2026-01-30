import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSubscribeToNewsletterMutation } from "../services/api";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  // Use the mutation hook
  const [subscribe, { isLoading }] = useSubscribeToNewsletterMutation();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(""); // Clear previous messages

    try {
      // Unwrap allows us to catch the error easily
      await subscribe({ email }).unwrap();
      setMsg("Subscribed! Welcome to the hive. 🐝");
      setEmail("");
    } catch (err: unknown) {
      // If unique=True fails (duplicate email)
      if (typeof err === "object" && err !== null && "data" in err) {
        const maybeErr = err as { data?: { email?: string | string[] } };
        if (maybeErr.data?.email) {
          setMsg("You are already subscribed! 🍯");
        } else {
          setMsg("Oops, something went wrong. Try again.");
        }
      } else {
        setMsg("Oops, something went wrong. Try again.");
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-honey-gold py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Join the Hive 🐝
          </h2>
          <p className="text-gray-900 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for sweet deals, new recipes, and
            buzz-worthy news.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto relative"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {isLoading ? "..." : "Subscribe"}
            </button>
          </form>

          {/* SUCCESS / ERROR MESSAGE DISPLAY */}
          {msg && (
            <p
              className={`mt-4 font-bold ${msg.includes("already") ? "text-gray-800" : "text-green-900"}`}
            >
              {msg}
            </p>
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-honey-gold mb-4">
            HoneyPot 🍯
          </h3>
          <p className="text-gray-400 text-sm">
            Pure, organic honey sourced directly from local beekeepers.
            Sweetening your life, one jar at a time.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4">Shop</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/shop" className="hover:text-honey-gold">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/deals" className="hover:text-honey-gold">
                Gifts & Deals
              </Link>
            </li>
            <li>
              <Link to="/shop?category=honey" className="hover:text-honey-gold">
                Raw Honey
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/about" className="hover:text-honey-gold">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-honey-gold">
                Blog & Recipes
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-honey-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4">Contact</h4>
          <p className="text-gray-400 mb-2">
            123 Beehive Lane, Galway, Ireland
          </p>
          <p className="text-gray-400">honeypot.shop96@gmail.com</p>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6 text-end text-gray-500 text-sm">
        © {new Date().getFullYear()} The Honey Pot. All rights reserved.
      </div>
      <div className="border-gray-800 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Powered by{" "}
        <Link to="https://missbott.online" className="font-bold underline">
          Miss Bott
        </Link>
        .
      </div>
    </footer>
  );
};

export default Footer;
