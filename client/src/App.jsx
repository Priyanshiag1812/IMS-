import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AddNewInventory from "./pages/Storeman/AddNewInventory.jsx";
import RestockInventory from "./pages/Storeman/RestockInventory.jsx";
import InventoryTable from "./pages/Storeman/InventoryTable.jsx";
import UpdateInventory from "./pages/Storeman/UpdateInventory.jsx";
import IssueInventory from "./pages/Storeman/IssueInventory.jsx";
import IssueInventoryTable from "./pages/Storeman/IssueInventoryTable.jsx";
import ReturnInventory from "./pages/Faculty/FacultyReturnInventory.jsx";
import FacultyRequestInventory from "./pages/Faculty/FacultyRequestInventory.jsx";
import RequestInventoryTable from "./pages/Storeman/RequestInventoryTable.jsx";
import FacultyReturnInventory from "./pages/Faculty/FacultyReturnInventory.jsx";
import Summary from "./pages/Storeman/Summary.jsx";
import ThreShold from "./pages/Storeman/Threshold.jsx";
import Login from "./pages/Login";
import First from "./pages/First";
import ProtectedRoute from "./components/ProtectedRouter";
import SignUp from "./pages/SignUp.jsx";
import PurchaseTable from "./pages/Storeman/PurchaseTable.jsx";
// import FacultyRequestInventoryTable from "./pages/Faculty/FacultyRequestInventoryTable.jsx";
import FacultyIssueInventoryTable from "./pages/Faculty/FacultyIssueInventoryTable.jsx";
import FacultyViewRequestTable from "./pages/Faculty/FacultyViewRequestTable.jsx";
import AdminRequestTable from "./pages/Admin/AdminRequestTable.jsx";
import AdminInventoryTable from "./pages/Admin/AdminInventoryTable.jsx";
import ModifyInventoryTable from "./pages/Storeman/ModifyInventoryTable.jsx";
import UpdatedInventoryTable from "./pages/Storeman/UpdatedInventoryTable.jsx";
import ReturnRequestTable from "./pages/Storeman/ReturnRequestTable.jsx";
import ModifyRequest from "./pages/Storeman/ModifyRequest.jsx";
import ModifyRequestTable from "./pages/Storeman/ModifyRequestTable.jsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <First />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signUp", element: <SignUp /> },
      {
        path: "/add-new-inventory",
        element: (
          <ProtectedRoute allowedRoles={["storeman" , "superAdmin"]}>
            <AddNewInventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/restock-inventory",
        element: (
          <ProtectedRoute allowedRoles={["storeman" , "superAdmin"]}>
            <RestockInventory />
          </ProtectedRoute>
        ),
      },

      {
        path: "/inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["storeman" , "superAdmin"]}>
            <InventoryTable />
          </ProtectedRoute>
        ),
      },

 {
        path: "/modify-inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["storeman" ,"admin" , "superAdmin"]}>
            <ModifyInventoryTable />
          </ProtectedRoute>
        ),
      },


      {
        path: "/issue-inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["admin", "storeman", "superAdmin"]}>
            <IssueInventoryTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/request-inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["admin", "storeman", "faculty", "superAdmin"]}>
            <RequestInventoryTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/update-inventory",
        element: (
          <ProtectedRoute allowedRoles={["storeman" , "admin", "superAdmin"]}>
            <UpdateInventory />
          </ProtectedRoute>
        ),
      },

   {
        path: "/updated-inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["storeman" , "admin", "superAdmin"]}>
            <UpdatedInventoryTable />
          </ProtectedRoute>
        ),
      },

      {
        path: "/issue-inventory",
        element: (
          <ProtectedRoute allowedRoles={["storeman", "superAdmin"]}>
            <IssueInventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/return-inventory",
        element: (
          <ProtectedRoute allowedRoles={["faculty", "superAdmin"]}>
            <ReturnInventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/purchase-table",
        element: (
          <ProtectedRoute allowedRoles={["admin", "storeman", "superAdmin"]}>
            <PurchaseTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/faculty-issue-inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["faculty", "superAdmin"]}>
            <FacultyIssueInventoryTable />
          </ProtectedRoute>
        ),
      },

      {
        path: "/faculty-view-request-table",
        element: (
          <ProtectedRoute allowedRoles={["admin", "faculty", "superAdmin"]}>
            <FacultyViewRequestTable />
          </ProtectedRoute>
        ),
      },

{
        path: "/modify-request",
        element: (
          <ProtectedRoute allowedRoles={["storeman", "superAdmin"]}>
            <ModifyRequest/>
          </ProtectedRoute>
        ),
      },


      {
        path: "/modify-request-table",
        element: (
          <ProtectedRoute allowedRoles={["storeman", "faculty","admin" ,"superAdmin"]}>
            <ModifyRequestTable/>
          </ProtectedRoute>
        ),
      },

      {
        path: "/return-request-table",
        element: (
          <ProtectedRoute allowedRoles={["storeman", "superAdmin"]}>
            <ReturnRequestTable />
          </ProtectedRoute>
        ),
      },

      {
        path: "/faculty-request-inventory",
        element: (
          <ProtectedRoute allowedRoles={["faculty", "superAdmin"]}>
            <FacultyRequestInventory />
          </ProtectedRoute>
        ),
      },

      {
        path: "/faculty-return-inventory",
        element: (
          <ProtectedRoute allowedRoles={["faculty", "superAdmin"]}>
            <FacultyReturnInventory />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "/faculty-request-inventory-table",
      //   element: (
      //     <ProtectedRoute allowedRoles={["admin", "faculty", "superAdmin"]}>
      //       <FacultyRequestInventoryTable />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: "/admin-request-table",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
            <AdminRequestTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/summary",
        element: (
          <ProtectedRoute allowedRoles={["admin", "storeman", "accountant", "superAdmin"]}>
            <Summary />
          </ProtectedRoute>
        ),
      },
      {
        path: "/threshold",
        element: (
          <ProtectedRoute allowedRoles={["admin", "storeman", "superAdmin"]}>
            <ThreShold />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
            <AdminInventoryTable />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
