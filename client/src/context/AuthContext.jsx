import { createContext, useContext, useEffect, useState } from "react";
import axios from "../AxiosConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const[fname,setFname]=useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get("/auth/checkToken");
      if (res.status === 200) {
        setIsAuthenticated(true);
        setRole(res.data.role);
        setFname(res.data.fname);

      }
    } catch (error) {
      setIsAuthenticated(false);
      setRole(null);
      setFname(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated,role,setRole,fname,setFname,checkAuth}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
