import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../services/api";
import { setCredentials } from "../services/authSlice";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // 1. Register with Django (allauth)
      // Note: We map passwordConfirm to 'pass2' or 'password_confirm' depending on Django setup.
      // Standard dj-rest-auth often just needs password1/password or handles validation internally.
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.passwordConfirm,
      };

      const user = await register(payload).unwrap();

      // 2. Auto Login (Save to Redux)
      // Sometimes registration returns the token immediately, sometimes it requires email verification.
      // Assuming it returns key + user:
      if (user.key) {
        dispatch(setCredentials({ user: user.user, token: user.key }));
        navigate("/");
      } else {
        // If email verification is on, tell them to check email
        alert("Please check your email to verify your account!");
        navigate("/login");
      }
    } catch (err: unknown) {
      console.error("Registration failed", err);
      // Try to extract a useful error message
      type ApiError = {
        data?: { username?: string[]; email?: string[]; password?: string[] };
      };
      const e = err as ApiError;
      const msg =
        e?.data?.username?.[0] ||
        e?.data?.email?.[0] ||
        e?.data?.password?.[0] ||
        "Registration failed. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <span className="text-4xl">🐝</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Join the Hive
          </h2>
          <p className="mt-2 text-sm text-gray-600">Create your account</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            required
            placeholder="Username"
            onChange={handleChange}
            className="input-field-auth"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email Address"
            onChange={handleChange}
            className="input-field-auth"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            onChange={handleChange}
            className="input-field-auth"
          />
          <input
            name="passwordConfirm"
            type="password"
            required
            placeholder="Confirm Password"
            onChange={handleChange}
            className="input-field-auth"
          />

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-honey-gold py-3 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>

          <div className="text-center text-sm">
            <Link
              to="/login"
              className="font-medium text-honey-gold hover:text-yellow-600"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>

      <style>{`
        .input-field-auth {
          display: block;
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          padding: 0.75rem;
          color: #111827;
          outline: none;
        }
        .input-field-auth:focus {
          ring: 2px solid #f59e0b;
          border-color: #f59e0b;
        }
      `}</style>
    </div>
  );
};

export default Register;
