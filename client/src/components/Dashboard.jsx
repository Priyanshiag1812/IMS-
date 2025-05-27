import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Instance from "../AxiosConfig";

function Dashboard() {
  const [role, setRole] = useState("");
  const location = useLocation();

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

  const getRoleHeading = () => {
    if (!role) return "Dashboard";
    return `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`;
  };

  const getNavLinkClass = (path) =>
    `py-3 text-lg px-5 border-b border-black transition-all duration-200 ${
      location.pathname === path
        ? "bg-slate-100 text-blue-900 font-bold rounded-l-md shadow-md border-l-4 border-yellow-400"
        : "text-blue-50 hover:font-bold hover:bg-gray-50 hover:text-blue-900"
    }`;

  return (
    <div className="left_side bg-blue-950 text-amber-50 fixed z-1 w-1/6 h-full">
      <div className="dashboard">
        <h1 className="bg-blue-900 text-center font-bold text-3xl px-6 py-5">
          {getRoleHeading()}
        </h1>

        <ul>
          {/* Storeman Access */}
          {role === "storeman" && (
            <>
              <Link to="/inventory-table">
                <li className={getNavLinkClass("/inventory-table")}>
                  Inventory Table
                </li>
              </Link>

              <Link to="/add-new-inventory">
                <li className={getNavLinkClass("/add-new-inventory")}>
                  Add Inventory
                </li>
              </Link>

              <Link to="/request-inventory-table">
                <li className={getNavLinkClass("/request-inventory-table")}>
                  View Request
                </li>
              </Link>


                <Link to="/return-request-table">
                <li className={getNavLinkClass("/return-request-table")}>
                  Return Request
                </li>
              </Link>

              <Link to="/issue-inventory-table">
                <li className={getNavLinkClass("/issue-inventory-table")}>
                  Issued Inventories
                </li>
              </Link>

                  <Link to="/modify-inventory-table">
                <li className={getNavLinkClass("/modify-inventory-table")}>
                 Edit Inventory
                </li>
              </Link>

              
                  <Link to="/modify-request-table">
                <li className={getNavLinkClass("/modify-request-table")}>
                 Modify Request Table
                </li>
              </Link>

                 <Link to="/updated-inventory-table">
                <li className={getNavLinkClass("/updated-inventory-table")}>
                 Updated Inventory Table
                </li>
              </Link>
              
              <Link to="/threshold">
                <li className={getNavLinkClass("/threshold")}>Threshold</li>
              </Link>

            
              <Link to="/summary">
                <li className={getNavLinkClass("/summary")}>Summary</li>
              </Link>
            </>
          )}

          {/* Admin Access */}
          {role === "admin" && (
            <>
              <Link to="/admin-inventory-table">
                <li className={getNavLinkClass("/admin-inventory-table")}>
                  Inventory Table
                </li>
              </Link>
              <Link to="/admin-request-table">
                <li className={getNavLinkClass("/admin-request-table")}>
                  View Requests
                </li>
              </Link>
              <Link to="/issue-inventory-table">
                <li className={getNavLinkClass("/issue-inventory-table")}>
                  Issued Inventories
                </li>
              </Link>

               <Link to="/updated-inventory-table">
                <li className={getNavLinkClass("/updated-inventory-table")}>
                 Updated Inventory Table
                </li>
              </Link>

              
              <Link to="/summary">
                <li className={getNavLinkClass("/summary")}>Summary</li>
              </Link>
            </>
          )}



{/* Super Admin Access */}
          {role === "superAdmin" && (
            <>
 <Link to="/inventory-table">
                <li className={getNavLinkClass("/inventory-table")}>
                  Inventory Table
                </li>
              </Link>

              {/* <Link to="/add-new-inventory">
                <li className={getNavLinkClass("/add-new-inventory")}>
                  Add Inventory
                </li>
              </Link> */}

              <Link to="/request-inventory-table">
                <li className={getNavLinkClass("/request-inventory-table")}>
                  View Request
                </li>
              </Link>


                <Link to="/return-request-table">
                <li className={getNavLinkClass("/return-request-table")}>
                  Return Request
                </li>
              </Link>

              <Link to="/issue-inventory-table">
                <li className={getNavLinkClass("/issue-inventory-table")}>
                  Issued Inventories
                </li>
              </Link>

                  <Link to="/modify-inventory-table">
                <li className={getNavLinkClass("/modify-inventory-table")}>
                 Edit Inventory
                </li>
              </Link>

              
                  <Link to="/modify-request-table">
                <li className={getNavLinkClass("/modify-request-table")}>
                 Modify Request Table
                </li>
              </Link>

                 {/* <Link to="/updated-inventory-table">
                <li className={getNavLinkClass("/updated-inventory-table")}>
                 Updated Inventory Table
                </li>
              </Link>
              
              <Link to="/threshold">
                <li className={getNavLinkClass("/threshold")}>Threshold</li>
              </Link> */}

            
              {/* <Link to="/summary">
                <li className={getNavLinkClass("/summary")}>Summary</li>
              </Link> */}
            
              {/* <Link to="/admin-inventory-table">
                <li className={getNavLinkClass("/admin-inventory-table")}>
                  Inventory Table
              //   </li>
              </Link>
               */}
              <Link to="/admin-request-table">
                <li className={getNavLinkClass("/admin-request-table")}>
                  View Requests
                </li>
              </Link>
              <Link to="/issue-inventory-table">
                <li className={getNavLinkClass("/issue-inventory-table")}>
                  Issued Inventories
                </li>
              </Link>

               {/* <Link to="/updated-inventory-table">
                <li className={getNavLinkClass("/updated-inventory-table")}>
                 Updated Inventory Table
                </li>
              </Link>

              
              <Link to="/summary">
                <li className={getNavLinkClass("/summary")}>Summary</li>
              </Link> */}
            </>
          )}




          {/* Faculty Access */}
          {role === "faculty" && (
            <>
              <Link to="/faculty-request-inventory">
                <li
                  className={getNavLinkClass(
                    "/faculty-request-inventory"
                  )}
                >
                  Request Inventory 
                </li>
              </Link>
              <Link to="/faculty-view-request-table">
                <li className={getNavLinkClass("/faculty-view-request-table")}>
                  View Requests
                </li>
              </Link>
              <Link to="/faculty-issue-inventory-table">
                <li
                  className={getNavLinkClass("/faculty-issue-inventory-table")}
                >
                  Issued Inventory
                </li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
