import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

const MemberDashboard = () => {
  return <h1>Team Member Dashboard</h1>;
};

const ManagerDashboard = () => {
  return <h1>Manager Dashboard</h1>;
};

const Unauthorized = () => {
  return <h1>Unauthorized Access</h1>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/member/dashboard"
          element={
            <ProtectedRoute allowedRoles={["TEAM_MEMBER"]}>
              <MemberDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
