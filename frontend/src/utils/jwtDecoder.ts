interface TokenPayload {
  id?: number;
  username?: string;
  role?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const getRoleFromToken = (token: string): string | null => {
  const payload = decodeToken(token);
  return payload?.role || null;
};

export const getUserIdFromToken = (token: string): number | null => {
  const payload = decodeToken(token);
  return payload?.id || null;
};
