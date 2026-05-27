import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResetPasswordConfirmMutation } from "../services/api";
import toast from "react-hot-toast";

const PasswordResetConfirm: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ pass1: "", pass2: "" });
  const [resetConfirm, { isLoading }] = useResetPasswordConfirmMutation();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pass1 !== formData.pass2) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await resetConfirm({
        uid: uid!,
        token: token!,
        new_password1: formData.pass1,
        new_password2: formData.pass2,
      }).unwrap();

      toast.success("Password reset successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Failed to reset password. The link may have expired.");
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Set New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            placeholder="New Password"
            value={formData.pass1}
            onChange={(e) =>
              setFormData({ ...formData, pass1: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded focus:ring-honey-gold focus:border-honey-gold"
          />
          <input
            type="password"
            required
            placeholder="Confirm New Password"
            value={formData.pass2}
            onChange={(e) =>
              setFormData({ ...formData, pass2: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded focus:ring-honey-gold focus:border-honey-gold"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-honey-gold py-2 text-white font-bold hover:bg-yellow-600 disabled:opacity-50"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
