import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import HRDashboard from "./pages/HRDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PublicVerification from "./pages/PublicVerification";

function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // =============================
  // NOT LOGGED IN
  // =============================

  if (!user) {
    return <Navigate to="/login" />;
  }

  // =============================
  // ADMIN
  // =============================

  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  // =============================
  // HR
  // =============================

  if (user.role === "hr") {
    return <HRDashboard />;
  }

  // =============================
  // EMPLOYEE
  // =============================

  if (user.role === "employee") {
    return <EmployeeDashboard />;
  }

  return <h2>Access denied</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Registration */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        
        {/* Public Employee Verification */}
        <Route
          path="/verify"
          element={<PublicVerification />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;