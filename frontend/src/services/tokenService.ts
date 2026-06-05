import { getRoleFromToken } from '../utils/jwtDecoder';

const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';

const USER_ID_KEY = "user_id";

export const setUserId = (id: number) => {
  localStorage.setItem(USER_ID_KEY, String(id));
};

export const getUserId = () => {
  return Number(localStorage.getItem(USER_ID_KEY));
};

export const clearUserId = () => {
  localStorage.removeItem(USER_ID_KEY);
};


export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  // Extract and store role from JWT token
  const role = getRoleFromToken(token);
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  }
};
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getRole = () => {
  const storedRole = localStorage.getItem(ROLE_KEY);
  if (storedRole) return storedRole;
  
  // Fallback: extract from current token if not stored
  const token = getToken();
  if (token) {
    const role = getRoleFromToken(token);
    if (role) {
      localStorage.setItem(ROLE_KEY, role);
      return role;
    }
  }
  
  return null;
};
export const setRole = (role: string) => localStorage.setItem(ROLE_KEY, role);
export const clearRole = () => localStorage.removeItem(ROLE_KEY);

export const isAuthenticated = () => Boolean(getToken());

export const clearAuth = () => {
  clearToken();
  clearRole();
};
