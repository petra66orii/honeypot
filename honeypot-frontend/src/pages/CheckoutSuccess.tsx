import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../services/cartSlice";

const CheckoutSuccess: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear the Redux cart now that payment is done
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl">🎉</div>
      <h2 className="mb-4 text-3xl font-bold text-green-600">
        Payment Successful!
      </h2>
      <p className="mb-8 text-gray-600 max-w-md">
        Thank you for your order. We have sent a confirmation email to your
        inbox.
      </p>
      <Link
        to="/"
        className="rounded-full bg-honey-gold px-8 py-3 font-semibold text-white hover:bg-yellow-600 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
