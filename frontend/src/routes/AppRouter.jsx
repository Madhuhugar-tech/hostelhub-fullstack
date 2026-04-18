import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import StudentHome from "../pages/student/StudentHome";
import StudentIssues from "../pages/student/StudentIssues";
import StudentBills from "../pages/student/StudentBills";
import StudentCommunity from "../pages/student/StudentCommunity";

import WardenDashboard from "../pages/warden/WardenDashboard";
import WardenComplaints from "../pages/warden/WardenComplaints";
import WardenBilling from "../pages/warden/WardenBilling";
import WardenCommunityBlocked from "../pages/warden/WardenCommunityBlocked";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="STUDENT" />}>
          <Route path="/student" element={<StudentHome />} />
          <Route path="/student/issues" element={<StudentIssues />} />
          <Route path="/student/bills" element={<StudentBills />} />
          <Route path="/student/community" element={<StudentCommunity />} />
        </Route>

        <Route element={<RoleRoute allowedRole="WARDEN" />}>
          <Route path="/warden" element={<WardenDashboard />} />
          <Route path="/warden/complaints" element={<WardenComplaints />} />
          <Route path="/warden/billing" element={<WardenBilling />} />
          <Route path="/warden/community" element={<WardenCommunityBlocked />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}