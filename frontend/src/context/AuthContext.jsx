// src/context/AuthContext.jsx
import {createContext, useContext, useEffect, useState} from "react";
import axios from "../services/api"; // Your Axios instance with credentials enabled
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth on page load
    axios
      .get(`${API_BASE_URL}/api/auth/verify`) // This route should verify JWT in cookie
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{authenticated, setAuthenticated, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
