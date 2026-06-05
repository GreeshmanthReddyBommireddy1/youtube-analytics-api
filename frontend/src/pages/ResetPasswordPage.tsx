import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    try {
      setError('');
      setMessage('');

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setIsLoading(true);

      const response = await axios.post(
        '/auth/reset-password',
        {
          token,
          newPassword
        }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: any) {

      setError(
        error?.response?.data?.message ||
        'Failed to reset password'
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-6">
          Reset Password
        </h1>

        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Reset Token
            </label>

            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Paste reset token"
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
                setNewPassword(e.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Enter new password"
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
                setConfirmPassword(e.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Confirm password"
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-xl">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded-xl">
              {message}
              <br />
              Redirecting to login...
            </div>
          )}

          <button
            onClick={handleResetPassword}
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl"
          >
            {isLoading
              ? 'Resetting Password...'
              : 'Reset Password'}
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full bg-slate-200 text-slate-800 py-3 rounded-xl"
          >
            Back To Login
          </button>

        </div>

      </div>
    </div>
  );
};

export default ResetPasswordPage;