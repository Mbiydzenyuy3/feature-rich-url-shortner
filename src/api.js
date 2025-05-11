// // src/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;

// src/apiFetch.js
// This replaces Axios with native fetch and handles token-based auth and base URL config
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// A helper to attach auth headers and parse JSON
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle non-2xx HTTP responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || "Request failed");
    error.response = errorData;
    throw error;
  }

  return response.json();
}

