import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useVerifyEmailMutation, useResendEmailVerificationMutation } from "../services/api";

const VerifyEmail: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const [verifyEmail, { isLoading, isSuccess, isError }] =
    useVerifyEmailMutation();
  const [resendEmail, { isLoading: isResending }] =
    useResendEmailVerificationMutation();
  const [email, setEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    if (key) {
      verifyEmail({ key });
    }
  }, [key, verifyEmail]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendMessage("");
    setResendError("");
    try {
      await resendEmail({ email }).unwrap();
      setResendMessage("Verification email sent. Please check your inbox.");
    } catch (err: unknown) {
      const errorMessage =
        (err as { data?: { email?: string[]; detail?: string } })?.data?.email?.[0] ||
        (err as { data?: { detail?: string } })?.data?.detail ||
        "Unable to resend verification email. Please try again.";
      setResendError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-4xl mb-4">🐝</div>

        {isLoading && (
          <h2 className="text-xl font-bold text-gray-800 animate-pulse">
            Verifying your email...
          </h2>
        )}

        {isSuccess && (
          <div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-6">
              Welcome to the hive. Your account is fully active.
            </p>
            <Link
              to="/login"
              className="bg-honey-gold text-white px-6 py-2 rounded-full font-bold hover:bg-yellow-600 transition"
            >
              Log In Now
            </Link>
          </div>
        )}

        {isError && (
          <div>
            <h2 className="text-2xl font-bold text-red-500 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              This link may be invalid or expired.
            </p>
            <form onSubmit={handleResend} className="mb-4">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-3"
              />
              <button
                type="submit"
                disabled={isResending}
                className="w-full rounded-full bg-honey-gold py-2 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </button>
              {resendMessage && (
                <p className="mt-3 text-sm text-green-600">{resendMessage}</p>
              )}
              {resendError && (
                <p className="mt-3 text-sm text-red-500">{resendError}</p>
              )}
            </form>
            <Link
              to="/login"
              className="text-honey-gold font-medium hover:underline"
            >
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
