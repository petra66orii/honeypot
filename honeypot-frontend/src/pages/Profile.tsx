import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { logout } from "../services/authSlice";
import { useLogoutMutation } from "../services/api";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutApi();
    dispatch(logout());
    navigate("/");
  };

  if (!user) {
    return (
      <div className="p-8 text-center">Please log in to view your profile.</div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="md:flex md:gap-12">
        {/* LEFT COLUMN: User Info */}
        <div className="md:w-1/3">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-honey-gold/10 text-3xl">
                🐝
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user.username}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full rounded-md border border-gray-200 px-4 py-2 text-left text-sm font-medium hover:bg-gray-50">
                My Addresses (Coming Soon)
              </button>
              <button
                onClick={handleLogout}
                className="w-full rounded-md border border-red-100 bg-red-50 px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-100"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order History */}
        <div className="mt-8 md:mt-0 md:w-2/3">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Order History
          </h2>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
            <p>API for orders coming next!</p>
            {/* We will replace this with a real list of orders in a moment */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
