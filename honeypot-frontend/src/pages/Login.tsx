import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useLazyGetUserQuery,
  useResendEmailVerificationMutation,
} from "../services/api";
import { setCredentials } from "../services/authSlice";

const Login: React.FC = () => {
  // 1. FIX: Remove 'email' from the initial state
  const [formData, setFormData] = useState({ username: "", password: "" });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [triggerGetUser] = useLazyGetUserQuery();
  const [resendEmail, { isLoading: isResending }] =
    useResendEmailVerificationMutation();

  const [error, setError] = useState<string | null>(null);
  const [resendEmailInput, setResendEmailInput] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resendEmailParam = params.get("resend_email");
    if (resendEmailParam) {
      resendEmail({ email: resendEmailParam })
        .unwrap()
        .then(() => {
          setShowResend(true);
          setResendEmailInput(resendEmailParam);
          setResendMessage("Verification email sent. Please check your inbox.");
          setResendError("");
        })
        .catch((err: unknown) => {
          setShowResend(true);
          setResendEmailInput(resendEmailParam);
          setResendMessage("");
          const errorMessage =
            (err as { data?: { email?: string[]; detail?: string } })?.data
              ?.email?.[0] ||
            (err as { data?: { detail?: string } })?.data?.detail ||
            "Unable to resend verification email. Please try again.";
          setResendError(errorMessage);
        });
    }
  }, [location.search, resendEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendMessage("");
    setResendError("");
    setShowResend(false);

    try {
      // Step 1: Login
      // This now sends ONLY { username: '...', password: '...' }
      // Django will handle figuring out if 'username' is actually an email.
      const tokenResponse = await login(formData).unwrap();
      const token = tokenResponse.key;

      // Step 2: Fetch User Details
      // Temporarily store token before user details are fetched; cast null to satisfy type
      dispatch(setCredentials({ user: null, token: token }));
      const userDetails = await triggerGetUser().unwrap();

      dispatch(setCredentials({ user: userDetails, token: token }));

      // Step 3: Redirect
      navigate("/");
    } catch (err: unknown) {
      // 2. DEBUGGING: Log the actual server data to see specific validation errors
      console.error("Login failed full error:", err);

      // Safely inspect potential server shape without using `any`
      type ServerError = { data?: unknown };
      const maybeErr = err as ServerError;
      console.log("Server response data:", maybeErr.data);

      let errorMsg = "Unable to log in. Please check your connection.";

      const data = maybeErr.data;
      if (data && typeof data === "object") {
        const d = data as Record<string, unknown>;

        if (
          Array.isArray(d.non_field_errors) &&
          typeof d.non_field_errors[0] === "string"
        ) {
          errorMsg = d.non_field_errors[0];
          if (errorMsg.toLowerCase().includes("email")) {
            errorMsg = "Please verify your email address before logging in.";
          }
        } else if (
          Array.isArray(d.username) &&
          typeof d.username[0] === "string"
        ) {
          errorMsg = `Username: ${d.username[0]}`;
        } else if (
          Array.isArray(d.password) &&
          typeof d.password[0] === "string"
        ) {
          errorMsg = `Password: ${d.password[0]}`;
        } else if (typeof d.detail === "string") {
          errorMsg = d.detail;
        }
      }

      const lowerError = errorMsg.toLowerCase();
      if (
        lowerError.includes("verify") ||
        lowerError.includes("verified") ||
        lowerError.includes("email")
      ) {
        setShowResend(true);
        if (!resendEmailInput && formData.username.includes("@")) {
          setResendEmailInput(formData.username);
        }
      }

      setError(errorMsg);
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendMessage("");
    setResendError("");
    try {
      await resendEmail({ email: resendEmailInput }).unwrap();
      setResendMessage("Verification email sent. Please check your inbox.");
    } catch (err: unknown) {
      const errorMessage =
        (err as { data?: { email?: string[]; detail?: string } })?.data
          ?.email?.[0] ||
        (err as { data?: { detail?: string } })?.data?.detail ||
        "Unable to resend verification email. Please try again.";
      setResendError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <span className="text-4xl">🍯</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your hive
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input
                name="username"
                type="text"
                required
                className="relative block w-full rounded-t-md border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-honey-gold sm:text-sm sm:leading-6"
                placeholder="Username or Email"
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="relative block w-full rounded-b-md border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-honey-gold sm:text-sm sm:leading-6"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Login failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
              {showResend && (
                <form onSubmit={handleResend} className="mt-4">
                  <input
                    type="email"
                    name="resend_email"
                    required
                    placeholder="Enter your email"
                    value={resendEmailInput}
                    onChange={(e) => setResendEmailInput(e.target.value)}
                    className="w-full rounded-md border border-red-200 px-3 py-2 text-sm mb-3"
                  />
                  <button
                    type="submit"
                    disabled={isResending}
                    className="w-full rounded-full bg-honey-gold py-2 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend Verification Email"}
                  </button>
                  {resendMessage && (
                    <p className="mt-3 text-sm text-green-600">
                      {resendMessage}
                    </p>
                  )}
                  {resendError && (
                    <p className="mt-3 text-sm text-red-500">{resendError}</p>
                  )}
                </form>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-full bg-honey-gold py-3 px-4 text-sm font-semibold text-white hover:bg-yellow-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 disabled:opacity-50"
          >
            {isLoading ? " buzzing in..." : "Sign in"}
          </button>

          <div className="text-center text-sm">
            <Link
              to="/password-reset"
              className="font-medium text-honey-gold hover:text-yellow-600"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="text-center text-sm">
            <Link
              to="/register"
              className="font-medium text-honey-gold hover:text-yellow-600"
            >
              Don't have an account? Join the hive
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
