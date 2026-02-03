import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useCreatePaymentIntentMutation } from "../services/api";
import CheckoutForm from "../components/CheckoutForm";

// Replace with your actual key
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const Checkout: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [createPaymentIntent] = useCreatePaymentIntentMutation(); // removed unused isLoading

  const [clientSecret, setClientSecret] = useState<string>("");
  const [stripePid, setStripePid] = useState<string>("");

  useEffect(() => {
    if (cartItems.length > 0 && !clientSecret) {
      // ensure item ids match API expectations (string)
      const itemsForApi = cartItems.map((item) => ({
        ...item,
        id: String(item.id),
      }));
      createPaymentIntent({ items: itemsForApi })
        .unwrap()
        .then((data) => {
          setClientSecret(data.clientSecret);
          setStripePid(data.id); // This now works because we added 'id' to api.ts
        })
        .catch((err) => console.error("Failed to init payment:", err));
    }
  }, [cartItems, createPaymentIntent, clientSecret]);

  if (cartItems.length === 0) {
    return <div className="text-center py-20">Your cart is empty.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Secure Checkout
      </h1>

      {clientSecret && stripePid && stripePromise ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm stripePid={stripePid} />
        </Elements>
      ) : (
        <div className="flex justify-center py-20">
          {!stripePromise ? (
            <div className="text-red-500 text-center">
              Missing Stripe public key. Please configure VITE_STRIPE_PUBLIC_KEY.
            </div>
          ) : (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey-gold"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout;
