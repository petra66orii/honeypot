import React, { useState } from "react";
import {
  useGetAdminUsersQuery,
  useDeleteUserMutation,
  useToggleUserStaffMutation,
  useGetAdminOrdersQuery,
} from "../../services/api";
import type { User, Order } from "../../services/types";
import UserDetailsModal from "../../components/admin/UserDetailsModal";

const AdminUsers: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data: usersData, isLoading } = useGetAdminUsersQuery({ page });

  // We fetch ALL orders (page 1 for now) to filter by user.
  // *Note: In a huge app, you'd fetch specific user orders via a separate API call.*
  const { data: ordersData } = useGetAdminOrdersQuery({ page: 1 });

  const [deleteUser] = useDeleteUserMutation();
  const [toggleStaff] = useToggleUserStaffMutation();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDelete = async (pk: number) => {
    if (
      window.confirm(
        "Are you sure? This will delete the user and their history.",
      )
    ) {
      await deleteUser(pk);
    }
  };

  // Helper to filter orders for the selected user
  const getUserOrders = (email: string): Order[] => {
    if (!ordersData) return [];
    return ordersData.results.filter((order) => order.email === email);
  };

  if (isLoading)
    return <div className="p-10 text-center">Loading Users... 👥</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        User Management 👥
      </h1>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {usersData?.results.map((user) => (
              <tr key={user.pk} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.is_staff ? (
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Customer
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.date_joined).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-honey-gold hover:text-yellow-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => toggleStaff(user.pk)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {user.is_staff ? "Demote" : "Promote"}
                  </button>
                  <button
                    onClick={() => handleDelete(user.pk)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (Simplified) */}
      <div className="mt-4 flex justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm pt-2">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          orders={getUserOrders(selectedUser.email)}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default AdminUsers;
