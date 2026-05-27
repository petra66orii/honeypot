import React, { useState } from "react";
import { useResetPasswordMutation } from "../services/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({ email }).unwrap();
    } catch (err) {
      console.error("Failed to request reset", err);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-6">
          <span className="text-3xl">🔑</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            Forgot Password?
          </h2>
          <p className="text-sm text-gray-500">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-green-800 font-medium">Check your inbox!</p>
            <p className="text-sm text-green-600 mt-1">
              We sent a reset link to {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey-gold focus:ring-honey-gold p-2 border"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-honey-gold py-2 text-white font-bold hover:bg-yellow-600 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
