import React from "react";
import { IoMdNotifications } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Instance from "../AxiosConfig";
import { useEffect, useState } from "react";

function Header() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await Instance.get("/auth/checkToken", {
        withCredentials: true,
      });
      setRole(res.data.role);
      console.log(res.data.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await Instance.post("/auth/logout");
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const [thresholdCount, setThresholdCount] = useState(0);

  useEffect(() => {
    const fetchThresholdCount = async () => {
      try {
        const res = await Instance.get("/add/getTable");
        let count = 0;

        res.data.forEach((category) => {
          category.items.forEach((item) => {
            if (item.qty < item.threshold) count += 1;
          });
        });

        setThresholdCount(count);
      } catch (error) {
        console.error("Error fetching threshold count:", error);
      }
    };

    fetchThresholdCount();
  }, []);

  return (
    <div className="right_side w-5/5">
      <div className="nav_bar bg-gray-200 w-full h-19 py-5 px-5 flex items-center justify-end">
        {/* Search Bar */}
        <div className="search_bar text-3xl font-bold text-blue-950 h-12  py-5 mx-40 flex justify-center items-center">
          Inventory Management System
        </div>
        {/* Storeman Access */}
        {role === "storeman" && (
          <div className="notification_btn border-1 text-black text-3xl px-2 py-2 rounded-lg mx-3">
            <Link to="/threshold">
              <IoMdNotifications className="text-black" />
              {thresholdCount > 0 && (
                <span className="absolute top-1.5 right-30 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {thresholdCount}
                </span>
              )}
            </Link>
          </div>
        )}

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className=" text-1xl px-2 py-2  bg-blue-900 text-white-50 border-1 rounded-lg  mx-3 hover:text-red-500 transition"
          >
            <p> Logout</p>
          </button>
        ) : (
          <div className=" text-black text-2xl px-1 py-2 rounded-full mx-1">
            <Link to="/login">
              <IoIosLogOut />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
