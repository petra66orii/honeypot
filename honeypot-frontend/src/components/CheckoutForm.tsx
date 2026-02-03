import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useGetUserProfileQuery, useSaveOrderMutation } from "../services/api";
import { COUNTRIES } from "../utils/countries";

interface CheckoutFormProps {
  stripePid: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ stripePid }) => {
  const stripe = useStripe();
  const elements = useElements();

  // Redux State
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const { data: profile } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  // API Hook to save order
  const [saveOrder] = useSaveOrderMutation();

  // Local Form State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    county: "",
    country: "IE",
  });
  const [hasPrefilled, setHasPrefilled] = useState(false);
  const [saveInfo, setSaveInfo] = useState(true);

  useEffect(() => {
    if (!profile || hasPrefilled) return;
    setFormData((prev) => ({
      ...prev,
      firstName: profile.first_name || prev.firstName,
      lastName: profile.last_name || prev.lastName,
      email: profile.email || prev.email,
      phone: profile.phone_number || prev.phone,
      address: profile.street_address1 || prev.address,
      city: profile.town || prev.city,
      county: profile.county || prev.county,
      postcode: profile.postcode || prev.postcode,
      country: profile.country || prev.country,
    }));
    setHasPrefilled(true);
  }, [profile, hasPrefilled]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (!formData.address || !formData.email) {
        throw new Error("Please fill in all required fields.");
      }

      // 1. Save Order to Django Backend
      const orderPayload = {
        order_data: formData,
        items: cartItems.map((item) => ({ ...item, id: String(item.id) })),
        stripe_pid: stripePid,
        save_info: isAuthenticated ? saveInfo : false,
      };

      // Type cast to 'any' to bypass strict TS check if needed, or rely on the updated API type
      const orderResponse = await saveOrder(orderPayload).unwrap();
      console.log("Order saved:", orderResponse.order_number);

      // 2. Confirm Payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          payment_method_data: {
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                postal_code: formData.postcode,
                country: formData.country,
              },
            },
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Checkout failed:", err);
        setErrorMessage(err.message || "Payment failed. Please try again.");
      } else {
        console.error("Checkout failed:", err);
        setErrorMessage(String(err) || "Payment failed. Please try again.");
        let serverError;
        type ErrorWithData = { data?: { error?: string } };
        if (
          typeof err === "object" &&
          err !== null &&
          "data" in err &&
          typeof (err as ErrorWithData).data === "object" &&
          (err as ErrorWithData).data !== null
        ) {
          serverError = (err as ErrorWithData).data?.error;
        }
        const generalError =
          typeof err === "object" && err !== null && "message" in err
            ? (err as { message?: string }).message
            : "Payment failed. Please try again.";
        setErrorMessage(
          serverError ?? generalError ?? "Payment failed. Please try again.",
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <h3 className="sm:col-span-2 text-lg font-medium text-gray-900">
          Contact Information
        </h3>
        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
          className="sm:col-span-2 input-field"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          onChange={handleChange}
          required
          className="sm:col-span-2 input-field"
        />

        <h3 className="sm:col-span-2 text-lg font-medium text-gray-900 mt-4">
          Shipping Address
        </h3>
        <input
          name="address"
          placeholder="Street Address"
          onChange={handleChange}
          required
          className="sm:col-span-2 input-field"
        />
        <input
          name="city"
          placeholder="City / Town"
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          name="county"
          placeholder="County / State"
          onChange={handleChange}
          className="input-field"
        />
        <input
          name="postcode"
          placeholder="Postal Code"
          onChange={handleChange}
          required
          className="input-field"
        />
        <select name="country" onChange={handleChange} className="input-field">
          {COUNTRIES.map((c) => (
            // Change 'code'/'name' to 'value'/'label'
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6">
        {isAuthenticated && (
          <label className="flex items-center gap-2 text-sm text-gray-700 mb-4">
            <input
              type="checkbox"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
            />
            Save this delivery information for next time
          </label>
        )}
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Payment Details
        </h3>
        <div className="p-4 border border-gray-200 rounded-md bg-white">
          <PaymentElement />
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full rounded-full bg-honey-gold px-6 py-4 text-lg font-bold text-white shadow-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isProcessing ? "Processing..." : `Pay €${totalAmount.toFixed(2)}`}
      </button>

      <style>{`
        .input-field {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.75rem;
          outline: none;
        }
        .input-field:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 1px #f59e0b;
        }
      `}</style>
    </form>
  );
};

export default CheckoutForm;
