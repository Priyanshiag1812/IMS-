import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AddNewInventory from "./pages/AddNewInventory.jsx";
import RestockInventory from "./pages/RestockInventory.jsx";
import InventoryTable from "./pages/InventoryTable";
import UpdateInventory from "./pages/UpdateInventory.jsx";
import IssueInventory from "./pages/IssueInventory";
import IssueInventoryTable from "./pages/IssueInventoryTable.jsx";
import ReturnInventory from "./pages/FacultyReturnInventory.jsx";
import FacultyRequestInventory from "./pages/FacultyRequestInventory.jsx";
import RequestInventoryTable from "./pages/RequestInventoryTable.jsx";
import FacultyReturnInventory from "./pages/FacultyReturnInventory.jsx";
import Summary from "./pages/Summary";
import ThreShold from "./pages/Threshold";
import Login from "./pages/Login";
import First from "./pages/First";
import ProtectedRoute from "./components/ProtectedRouter";
import SignUp from "./pages/SignUp.jsx";
import PurchaseTable from "./pages/PurchaseTable.jsx";
import FacultyRequestInventoryTable from "./pages/FacultyRequestInventoryTable.jsx";
import FacultyIssueInventoryTable from "./pages/FacultyIssueInventoryTable.jsx";
import FacultyViewRequestTable from "./pages/FacultyViewRequestTable.jsx";
import AdminRequestTable from "./pages/AdminRequestTable.jsx";
import AdminInventoryTable from "./pages/AdminInventoryTable.jsx";


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
          <ProtectedRoute allowedRoles={["storeman"]}>
            <AddNewInventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/restock-inventory",
        element: (
          <ProtectedRoute allowedRoles={["storeman"]}>
            <RestockInventory />
          </ProtectedRoute>
        ),
      },

      {
        path: "/inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["storeman"]}>
            <InventoryTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/issue-inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["admin", "storeman"]}>
            <IssueInventoryTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/request-inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["admin", "storeman", "faculty"]}>
            <RequestInventoryTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/update-inventory",
        element: (
          <ProtectedRoute allowedRoles={["storeman" , "admin"]}>
            <UpdateInventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/issue-inventory",
        element: (
          <ProtectedRoute allowedRoles={["storeman"]}>
            <IssueInventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/return-inventory",
        element: (
          <ProtectedRoute allowedRoles={["faculty"]}>
            <ReturnInventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/purchase-table",
        element: (
          <ProtectedRoute allowedRoles={["admin", "storeman"]}>
            <PurchaseTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/faculty-issue-inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyIssueInventoryTable />
          </ProtectedRoute>
        ),
      },

      {
        path: "/faculty-view-request-table",
        element: (
          <ProtectedRoute allowedRoles={["admin", "faculty"]}>
            <FacultyViewRequestTable />
          </ProtectedRoute>
        ),
      },

      {
        path: "/faculty-request-inventory",
        element: (
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyRequestInventory />
          </ProtectedRoute>
        ),
      },

      {
        path: "/faculty-return-inventory",
        element: (
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyReturnInventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/faculty-request-inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["admin", "faculty"]}>
            <FacultyRequestInventoryTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-request-table",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminRequestTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/summary",
        element: (
          <ProtectedRoute allowedRoles={["admin", "storeman", "accountant"]}>
            <Summary />
          </ProtectedRoute>
        ),
      },
      {
        path: "/threshold",
        element: (
          <ProtectedRoute allowedRoles={["admin", "storeman"]}>
            <ThreShold />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-inventory-table",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
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
