// config/apiConfig.js
/**
 * Centralized API configuration utility
 * Ensures consistent API base URL construction across the application
 */

/**
 * Normalizes the API base URL to always end with /api
 * Handles cases where REACT_APP_API_BASE_URL might be set with or without /api
 * 
 * @returns {string} Normalized API base URL ending with /api
 */
export const getApiBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_BASE_URL;
  
  if (!envUrl) {
    // Default to localhost for development
    return "http://localhost:5000/api";
  }
  
  // Remove trailing slash if present
  const cleanUrl = envUrl.trim().replace(/\/$/, "");
  
  // Ensure it ends with /api
  if (cleanUrl.endsWith("/api")) {
    return cleanUrl;
  }
  
  // If it doesn't end with /api, append it
  return `${cleanUrl}/api`;
};

/**
 * Gets the full API endpoint URL for a given path
 * Automatically handles the /api prefix
 * 
 * @param {string} path - API path (e.g., "/auth/login", "/predict")
 * @returns {string} Full API URL
 */
export const getApiUrl = (path) => {
  const baseUrl = getApiBaseUrl();
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Gets the base URL without /api (for Socket.IO, etc.)
 * 
 * @returns {string} Base URL without /api suffix
 */
export const getBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_BASE_URL;
  
  if (!envUrl) {
    return "http://localhost:5000";
  }
  
  // Remove trailing slash if present
  let cleanUrl = envUrl.trim().replace(/\/$/, "");
  
  // Remove /api suffix if present
  if (cleanUrl.endsWith("/api")) {
    cleanUrl = cleanUrl.slice(0, -4);
  }
  
  return cleanUrl;
};

/**
 * Gets the Socket.IO URL
 * Falls back to REACT_APP_SOCKET_URL or constructs from API base URL
 * 
 * @returns {string} Socket.IO server URL
 */
export const getSocketUrl = () => {
  if (process.env.REACT_APP_SOCKET_URL) {
    return process.env.REACT_APP_SOCKET_URL;
  }
  
  // Fallback to base URL (without /api)
  return getBaseUrl();
};
