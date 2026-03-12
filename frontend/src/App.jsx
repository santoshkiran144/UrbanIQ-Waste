import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AppLayout from "./layouts/AppLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHouseholdDetails from "./pages/AdminHouseholdDetails";
import CollectorDashboard from "./pages/CollectorDashboard";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ResidentDashboard from "./pages/ResidentDashboard";
import SignupPage from "./pages/SignupPage";
import ViolationDetails from "./pages/ViolationDetails";

const DashboardRedirect = () => {
  const { user } = useAuth();
  return <Navigate replace to={user ? `/dashboard/${user.role}` : "/login"} />;
};

const App = () => (
  <Routes>
    <Route element={<HomePage />} path="/" />
    <Route element={<LoginPage />} path="/login" />
    <Route element={<SignupPage />} path="/signup" />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route element={<DashboardRedirect />} path="/dashboard" />
        <Route element={<ProtectedRoute roles={["collector"]} />}>
          <Route element={<CollectorDashboard />} path="/dashboard/collector" />
          <Route element={<ViolationDetails />} path="/dashboard/collector/violations/:violationId" />
        </Route>
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route element={<AdminDashboard />} path="/dashboard/admin" />
          <Route element={<AdminHouseholdDetails />} path="/dashboard/admin/households/:householdId" />
          <Route element={<ViolationDetails />} path="/dashboard/admin/violations/:violationId" />
        </Route>
        <Route element={<ProtectedRoute roles={["resident"]} />}>
          <Route element={<ResidentDashboard />} path="/dashboard/resident" />
        </Route>
      </Route>
    </Route>
  </Routes>
);

export default App;
