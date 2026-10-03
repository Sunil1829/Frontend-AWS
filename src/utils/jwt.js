/**
 * Decode JWT token payload without external library
 * @param {string} token - JWT token string
 * @returns {object|null} Decoded payload object or null if invalid
 */
export const decodeToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Replace url-safe characters and add padding if needed
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

/**
 * Check if a JWT token has expired
 * @param {string} token 
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false; // If no exp field, assume valid
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};
