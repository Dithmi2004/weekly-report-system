import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/Auth/LoginPage";
import ManagerDashboard from "../pages/Manager/ManagerDashboard";
import ManagerTasks from "../pages/Manager/ManagerTasks";
import MemberDashboard from "../pages/Member/MemberDashboard";
import MemberTasks from "../pages/Member/MemberTasks";

import ProtectedRoute from "./ProtectedRoute";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-red-600">403</h1>
        <h2 className="mt-2 text-2xl font-semibold text-slate-800">
          Unauthorized
        </h2>
        <p className="mt-3 text-slate-500">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  );
};

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-slate-800">
          Page Not Found
        </h2>
        <p className="mt-3 text-slate-500">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Team Member Routes */}
        <Route
          path="/member/dashboard"
          element={
            <ProtectedRoute allowedRoles={["TEAM_MEMBER"]}>
              <MemberDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/tasks"
          element={
            <ProtectedRoute allowedRoles={["TEAM_MEMBER"]}>
              <MemberTasks />
            </ProtectedRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/tasks"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerTasks />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
