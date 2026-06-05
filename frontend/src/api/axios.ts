import axios from 'axios';
import { getToken } from '../services/tokenService';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default apiClient;
