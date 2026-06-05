import apiClient from '../api/axios';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload);
  return response.data;
};
