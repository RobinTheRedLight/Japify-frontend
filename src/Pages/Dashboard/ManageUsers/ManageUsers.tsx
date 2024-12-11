import { useState } from "react";
import Swal from "sweetalert2";
import {
  useGetUsersQuery,
  useUpdateProfileMutation,
} from "../../../redux/features/user/userApi";
import { User } from "../../../types/user.type";
import { Helmet } from "react-helmet-async";
import Loading from "../../../components/Loading";
import { CiSearch } from "react-icons/ci";

const ManageUsers = () => {
  const { data, isLoading, isError, error } = useGetUsersQuery(undefined);
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateProfileMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">
          Failed to load users: {error.toString()}
        </p>
      </div>
    );
  }

  const users: User[] = data.data;

  const handleUpdateRole = async (user: User, newRole: string) => {
    try {
      const profileData = { role: newRole };
      await updateProfile({ profileData, id: user._id }).unwrap();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `User role updated to ${newRole}`,
        showConfirmButton: false,
        timer: 1500,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to update user role",
        text: err?.data?.message || "An unexpected error occurred.",
        showConfirmButton: false,
        timer: 2000,
      });
      console.error("Error updating user role:", err);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const confirmRoleChange = (newRole: string) => {
    if (selectedUser) {
      handleUpdateRole(selectedUser, newRole);
      closeModal();
    }
  };

  return (
    <div className="h-screen container mx-auto p-4 lg:mt-0 mt-10">
      <Helmet>
        <title>Dashboard | Manage Users</title>
      </Helmet>
      <div className="h-full bg-white  shadow-lg rounded-lg p-6 lg:p-8 ">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <h3 className="text-2xl lg:text-3xl font-semibold text-gray-800">
            Manage Users
          </h3>
          <div className="relative mt-4 lg:mt-0 w-full lg:w-1/3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <CiSearch className="h-6 w-6 text-gray-400" />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search Users"
            />
          </div>
        </div>

        {/* Table View for Large Screens */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user: User, index: number) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <button
                      onClick={() => openModal(user)}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                        user.role === "admin"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        user.role === "admin"
                          ? "focus:ring-red-500"
                          : "focus:ring-green-500"
                      }`}
                      aria-label={`Change role for ${user.name}`}
                    >
                      {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card View for Small Screens */}
        <div className="block lg:hidden">
          {filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user: User, index: number) => (
                <div
                  key={user._id}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <h4 className="text-lg font-medium text-gray-800">
                      {user.name}
                    </h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="mt-auto">
                    <button
                      onClick={() => openModal(user)}
                      className={`w-full inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        user.role === "admin"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        user.role === "admin"
                          ? "focus:ring-red-500"
                          : "focus:ring-green-500"
                      }`}
                      aria-label={`Change role for ${user.name}`}
                    >
                      {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No users found.</div>
          )}
        </div>
      </div>

      {/* Modal for Confirming Role Change */}
      {isModalOpen && selectedUser && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="px-6 py-4">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                {selectedUser.role === "admin"
                  ? "Revoke Admin Rights"
                  : "Grant Admin Rights"}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to{" "}
                  {selectedUser.role === "admin" ? "revoke" : "grant"} admin
                  rights to{" "}
                  <span className="font-semibold">{selectedUser.name}</span>?
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm ${
                  selectedUser.role === "admin"
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                onClick={() =>
                  confirmRoleChange(
                    selectedUser.role === "admin" ? "user" : "admin"
                  )
                }
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : null}
                {selectedUser.role === "admin" ? "Revoke" : "Grant"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
