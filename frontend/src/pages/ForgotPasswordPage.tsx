import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateToken = async () => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('');

      const response = await axios.post(
        '/auth/forgot-password',
        {
          username
        }
      );

      setToken(response.data.token);
      setMessage(response.data.message);

    } catch (error: any) {

      setError(
        error?.response?.data?.message ||
        'Failed to generate token'
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </h1>

        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Enter username"
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
            </div>
          )}

          {token && (
            <div className="bg-blue-100 text-blue-700 p-3 rounded-xl break-all">
              <strong>Reset Token:</strong>
              <br />
              {token}
            </div>
          )}

          <button
            onClick={handleGenerateToken}
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl"
          >
            {isLoading
              ? 'Generating...'
              : 'Generate Reset Token'}
          </button>

          {token && (
            <button
              onClick={() =>
                navigate('/reset-password')
              }
              className="w-full bg-sky-600 text-white py-3 rounded-xl"
            >
              Go To Reset Password
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;