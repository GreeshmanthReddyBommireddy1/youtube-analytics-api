import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import { setToken, setRole } from '../services/tokenService';
import type { LoginRequest, LoginResponse } from '../types/auth';

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (payload: LoginRequest) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login(payload);
      const authToken = response.token || response.accessToken;
      if (!authToken) {
        throw new Error('Login response did not include a valid token.');
      }
      setToken(authToken);
      
      // Store role if available
      if (response.role) {
        setRole(response.role);
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      const fallbackMessage = 'Unable to reach the backend. Confirm the server is running at http://localhost:3000';
      setError(err?.response?.data?.message || err?.message || fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, login };
};

export default useLogin;
