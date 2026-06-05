import { useState } from 'react';
import axios from '../api/axios';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (
      newPassword.trim() !==
      confirmPassword.trim()
    ) {
      setError(
        'New Password and Confirm Password do not match'
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.put(
        '/auth/change-password',
        {
          currentPassword,
          newPassword
        }
      );

      setMessage(response.data.message);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error: any) {

      setError(
        error?.response?.data?.message ||
        'Failed to change password'
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-6">

      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">
          🔐 Change Password
        </h1>

        <p className="mt-2 text-slate-600">
          Update your account password securely.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">

        <form
          onSubmit={handleChangePassword}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-50 p-4 text-rose-700">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isLoading
              ? 'Updating Password...'
              : 'Change Password'}
          </button>

        </form>

      </div>

    </section>
  );
};

export default ChangePasswordPage;