import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { logout } from "../services/authSlice";
import {
  useLogoutMutation,
  useGetMyOrdersQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../services/api";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  // 1. Fetch Data
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const { data: profile } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  // 2. Local State for Form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: "",
    street_address1: "",
    street_address2: "",
    town: "",
    county: "",
    postcode: "",
    country: "IE",
  });
  const [msg, setMsg] = useState("");

  const handleLogout = async () => {
    await logoutApi();
    dispatch(logout());
    navigate("/");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      setMsg("Address updated successfully!");
      setTimeout(() => setMsg(""), 3000);
      setShowForm(false);
    } catch (err) {
      console.error("Update failed", err);
      setMsg("Failed to update address.");
    }
  };

  if (!user) return null;

  const handleToggleForm = () => {
    // If we are about to OPEN the form, populate it with the latest profile data
    if (!showForm && profile) {
      setFormData({
        phone_number: profile.phone_number || "",
        street_address1: profile.street_address1 || "",
        street_address2: profile.street_address2 || "",
        town: profile.town || "",
        county: profile.county || "",
        postcode: profile.postcode || "",
        country: profile.country || "IE",
      });
    }
    // Toggle the visibility
    setShowForm(!showForm);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="md:flex md:gap-12">
        {/* LEFT COLUMN: User Info & Address Form */}
        <div className="md:w-1/3 mb-8">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm sticky top-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-honey-gold/10 text-3xl">
                🐝
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user.username}
                </h2>
                <p className="text-sm text-gray-500">
                  {user.email || "No email"}
                </p>
              </div>
            </div>

            {/* Address Management Toggle */}
            <button
              onClick={handleToggleForm} // <--- Use the new handler here!
              className="w-full mb-3 rounded-md border border-honey-gold text-honey-gold px-4 py-2 text-sm font-bold hover:bg-yellow-50 transition"
            >
              {showForm ? "Cancel Editing" : "Update Address"}
            </button>

            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-3 mb-4">
                <input
                  name="street_address1"
                  placeholder="Street Address"
                  value={formData.street_address1}
                  onChange={handleChange}
                  className="w-full border p-2 rounded text-sm"
                />
                <input
                  name="town"
                  placeholder="City / Town"
                  value={formData.town}
                  onChange={handleChange}
                  className="w-full border p-2 rounded text-sm"
                />
                <input
                  name="postcode"
                  placeholder="Postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="w-full border p-2 rounded text-sm"
                />
                <input
                  name="county"
                  placeholder="County"
                  value={formData.county}
                  onChange={handleChange}
                  className="w-full border p-2 rounded text-sm"
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border p-2 rounded text-sm"
                >
                  <option value="IE">Ireland</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                </select>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-honey-gold text-white rounded p-2 text-sm font-bold hover:bg-yellow-600"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}

            {msg && (
              <p className="text-sm text-green-600 text-center mb-4">{msg}</p>
            )}

            <button
              onClick={handleLogout}
              className="w-full rounded-md border border-red-100 bg-red-50 px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-100 transition"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="md:w-2/3">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Order History
          </h2>

          {isLoading ? (
            <div className="text-center py-10">
              Loading your hive history...
            </div>
          ) : error ? (
            <div className="text-red-500">Failed to load orders.</div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.order_number}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.order_number.slice(0, 8)}...
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        €{order.total_price}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {order.status || "Paid"}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity} x{" "}
                          <span className="font-medium text-gray-800">
                            {item.product_name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
              <span className="text-4xl block mb-4">🕸️</span>
              <p className="text-gray-500">
                You haven't placed any orders yet.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 text-honey-gold font-bold hover:underline"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
