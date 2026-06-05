import { useState, useEffect } from 'react';
import { getRole } from '../services/tokenService';
import * as userService from '../services/userService';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/models';

type UserRole = 'admin' | 'creator' | 'viewer';

interface FormData {
  username: string;
  email: string;
  full_name: string;
  country_code: string;
}

interface EditFormData {
  full_name: string;
  country_code: string;
}

const UsersPage = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const isAdmin = role === 'admin';

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createFormData, setCreateFormData] = useState<FormData>({
    username: '',
    email: '',
    full_name: '',
    country_code: '',
  });

  const [editFormData, setEditFormData] = useState<EditFormData>({
    full_name: '',
    country_code: '',
  });

  useEffect(() => {
    const currentRole = getRole() as UserRole | null;
    setRole(currentRole);
    console.log('UsersPage: Current role =', currentRole);
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      console.log('Users fetched:', data);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Failed to fetch users';
      setError(errorMsg);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleShowSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload: CreateUserRequest = {
        username: createFormData.username,
        email: createFormData.email,
        full_name: createFormData.full_name,
        country_code: createFormData.country_code,
      };

      await userService.createUser(payload);
      handleShowSuccessMessage('User created successfully');
      setShowCreateModal(false);
      setCreateFormData({
        username: '',
        email: '',
        full_name: '',
        country_code: '',
      });
      await fetchUsers();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Failed to create user';
      setError(errorMsg);
      console.error('Error creating user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUserId(user.user_id);
    setEditFormData({
      full_name: user.full_name,
      country_code: user.country_code,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (editingUserId === null) return;

    try {
      const payload: UpdateUserRequest = {
        full_name: editFormData.full_name,
        country_code: editFormData.country_code,
      };

      await userService.updateUser(editingUserId, payload);
      handleShowSuccessMessage('User updated successfully');
      setShowEditModal(false);
      setEditingUserId(null);
      await fetchUsers();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Failed to update user';
      setError(errorMsg);
      console.error('Error updating user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: number, username: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await userService.deleteUser(userId);
      handleShowSuccessMessage('User deleted successfully');
      await fetchUsers();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Failed to delete user';
      setError(errorMsg);
      console.error('Error deleting user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({
      username: '',
      email: '',
      full_name: '',
      country_code: '',
    });
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUserId(null);
    setEditFormData({
      full_name: '',
      country_code: '',
    });
  };

  if (!isAdmin) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-2xl">!</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Access Denied</h2>
            <p className="mt-2 text-slate-600">Only admins can access the Users Management page.</p>
            <p className="mt-1 text-sm text-slate-500">Your current role: <span className="font-medium capitalize">{role || 'unknown'}</span></p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Users Management</h1>
            <p className="mt-2 text-slate-600">Create, manage, and delete user accounts</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
            disabled={isSubmitting}
          >
            + Create User
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
          <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200">
          <p className="text-sm font-medium text-rose-700">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
            <p className="ml-4 text-slate-600">Loading users...</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-slate-600">No users found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 rounded-2xl bg-slate-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Create First User
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Full Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Country</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900 font-mono">{user.user_id}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">{user.username || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.email || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{user.full_name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{user.country_code || '—'}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          disabled={isSubmitting}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.user_id, user.username)}
                          disabled={isSubmitting}
                          className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <p className="text-sm text-slate-600">Total Users: <span className="font-semibold">{users.length}</span></p>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900">Create New User</h2>

            <form className="mt-6 space-y-4" onSubmit={handleCreateSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Username *</label>
                <input
                  type="text"
                  value={createFormData.username}
                  onChange={(e) => setCreateFormData({ ...createFormData, username: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:opacity-50"
                  placeholder="john_doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Email *</label>
                <input
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:opacity-50"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name *</label>
                <input
                  type="text"
                  value={createFormData.full_name}
                  onChange={(e) => setCreateFormData({ ...createFormData, full_name: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:opacity-50"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Country Code *</label>
                <input
                  type="text"
                  value={createFormData.country_code}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      country_code: e.target.value.toUpperCase().slice(0, 2),
                    })
                  }
                  required
                  disabled={isSubmitting}
                  maxLength={2}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:opacity-50"
                  placeholder="US"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={isSubmitting}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-900 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900">Edit User</h2>

            <form className="mt-6 space-y-4" onSubmit={handleEditSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name *</label>
                <input
                  type="text"
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:opacity-50"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Country Code *</label>
                <input
                  type="text"
                  value={editFormData.country_code}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      country_code: e.target.value.toUpperCase().slice(0, 2),
                    })
                  }
                  required
                  disabled={isSubmitting}
                  maxLength={2}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:opacity-50"
                  placeholder="US"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update User'}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isSubmitting}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-900 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default UsersPage;
