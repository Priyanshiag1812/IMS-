import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import Login from "../pages/Login";
import { Outlet } from "react-router-dom";

function First() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-white-100 relative">
      <div className="min-h-screen w-1/6">{<Dashboard />}</div>
      <main className="min-h-screen w-full bg-gray-100">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}

export default First;
