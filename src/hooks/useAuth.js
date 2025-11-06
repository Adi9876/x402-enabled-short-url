import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create axios instance with credentials
  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await api.get("/user/me");
      setUser(response.data?.user || null);
      return true;
    } catch (err) {
      setUser(null);
      return false;
    }
  };

  // Sign up
  const signup = async (name, email, password) => {
    try {
      setError(null);
      const response = await api.post("/user", {
        name,
        email,
        password,
      });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Signup failed";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post("/user/login", {
        email,
        password,
      });
      setUser(response.data?.user || { email });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || "Login failed";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/user/logout");
      setUser(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    // Check auth on mount
    checkAuth().finally(() => setIsLoading(false));
  }, []);

  return {
    user,
    isLoading,
    error,
    signup,
    login,
    logout,
    api, // Export the configured axios instance
  };
}
