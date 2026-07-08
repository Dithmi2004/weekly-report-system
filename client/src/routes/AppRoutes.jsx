import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ManagerBlockers from "../pages/Manager/ManagerBlockers";
import ManagerDashboard from "../pages/Manager/ManagerDashboard";
import ManagerProjects from "../pages/Manager/ManagerProjects";
import ManagerReportDetails from "../pages/Manager/ManagerReportDetails";
import ManagerReports from "../pages/Manager/ManagerReports";
import ManagerTasks from "../pages/Manager/ManagerTasks";
import ManagerUsers from "../pages/Manager/ManagerUsers";
import MemberDashboard from "../pages/Member/MemberDashboard";
import MemberProjects from "../pages/Member/MemberProjects";
import MemberReportDetails from "../pages/Member/MemberReportDetails";
import MemberReportFormPage from "../pages/Member/MemberReportFormPage";
import MemberReports from "../pages/Member/MemberReports";
import MemberTasks from "../pages/Member/MemberTasks";
import ProfilePage from "../pages/Profile/ProfilePage";

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
        <Route path="/register" element={<RegisterPage />} />

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
          path="/member/projects"
          element={
            <ProtectedRoute allowedRoles={["TEAM_MEMBER"]}>
              <MemberProjects />
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

        <Route
          path="/member/reports"
          element={
            <ProtectedRoute allowedRoles={["TEAM_MEMBER"]}>
              <MemberReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/reports/create"
          element={
            <ProtectedRoute allowedRoles={["TEAM_MEMBER"]}>
              <MemberReportFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/reports/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["TEAM_MEMBER"]}>
              <MemberReportFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/reports/:id"
          element={
            <ProtectedRoute allowedRoles={["TEAM_MEMBER"]}>
              <MemberReportDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/profile"
          element={
            <ProtectedRoute allowedRoles={["TEAM_MEMBER"]}>
              <ProfilePage />
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

        <Route
          path="/manager/projects"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/blockers"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerBlockers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/reports"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/reports/:id"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerReportDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/users"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/profile"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ProfilePage />
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
