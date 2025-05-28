import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Instance from "../AxiosConfig";

function ProtectedRoute({ children,allowedRoles }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const[fname,setFname]=useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkForToken();
  }, []);

  async function checkForToken() {
    try {
      setLoading(true);
      const response = await Instance.get("/auth/checkToken");
      if (response.status === 200) {
        setIsAuthenticated(true);
        setRole(response.data.role);
        setFname(response.data.fname);
        setLoading(false);
      }else{
        setIsAuthenticated(false);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
      setLoading(true);
    } finally {
      setLoading(false);
    }
  }
  if (loading) return <div id="">LOADING...</div>;
  
  if(!isAuthenticated){
    return <Navigate to="/login" replace />;
  }

  if(allowedRoles && !allowedRoles.includes(role)){
    return <Navigate to="/inventory-table" replace />;
  }
  return children;
}

export default ProtectedRoute;
