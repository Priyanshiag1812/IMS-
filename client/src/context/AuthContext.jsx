import { createContext, useContext, useEffect, useState } from "react";
import axios from "../AxiosConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get("/auth/checkToken");
      if (res.status === 200) {
        setIsAuthenticated(true);
        setRole(res.data.role);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated,role,setRole,checkAuth}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
