import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// 🔹 Common
import Navbar from "./Components/Navbar";
import LandingPage from "./Components/Pages/LandingPage";
import AdminLogin from "./Components/Pages/AdminAuth/AdminLogin";
import AdminRegister from "./Components/Pages/AdminAuth/AdminRegister";
import UserLogin from "./Components/Pages/UserAuth/UserLogin";
import UserRegister from "./Components/Pages/UserAuth/UserRegister";
import SuperAdminLogin from "./Components/Pages/SuperAdmin/SuperAdminLogin";
import SuperAdminRegister from "./Components/Pages/SuperAdmin/SuperAdminRegister";
import SuperAdminDashboard from "./Components/Pages/SuperAdmin/SuperAdminDashboard";

import AdminDashboard from "./Components/AdminDashboard";
import AdminCreateProject from "./Components/AdminCreateProject";
import AdminAssignProject from "./Components/AdminAssignProject";
import CreateOrganization from "./Components/CreateOrganization";
import SelectOrganization from "./Components/SelectOrganization";

// 🔹 Tester Pages
import TesterDashboard from "./Components/TesterDashboard";
import TesterProfile from "./Components/TesterProfile";
import TesterBugList from "./Components/TesterBugList";
import ProjectList from "./Components/ProjectList";
import TesterProjectDashboard from "./Components/TesterProjectDashboard";
import RaiseBug from "./Components/RaiseBug";

// 🔹 Developer Pages
import BugList from "./Components/BugList";
import DeveloperProfile from "./Components/DeveloperProfile";

// 🔹 Bug Pages
import BugOverview from "./Components/BugOverview";
import BugChat from "./Components/BugChat";
import ManageAccess from "./Components/ManageAccess";
import TeamPortal from "./Components/TeamPortal";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar handles visibility internally */}
        <Navbar />

        <Routes>
          {/* 🌍 Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* 🔐 Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* 🔐 User Auth */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />

          {/* 🔐 Super Admin Auth */}
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/super-admin/register" element={<SuperAdminRegister />} />

          {/* 🧠 Super Admin */}
          <Route
            path="/super-admin/dashboard"
            element={<SuperAdminDashboard />}
          />

          {/* 🏢 Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-access" element={<ManageAccess />} />
          <Route
            path="/admin/create-project"
            element={<AdminCreateProject />}
          />
          <Route
            path="/admin/assign-project"
            element={<AdminAssignProject />}
          />
          <Route
            path="/admin/create-organization"
            element={<CreateOrganization />}
          />
          <Route
            path="/admin/select-organization"
            element={<SelectOrganization />}
          />
          <Route path="/admin/team-portal" element={<TeamPortal />} />

          {/* 🧪 Tester */}
          <Route path="/tester/dashboard" element={<TesterDashboard />} />
          <Route
            path="/tester/projects/:org_id"
            element={<ProjectList />}
          />
          <Route
            path="/tester/project/:project_id"
            element={<TesterProjectDashboard />}
          />
          <Route path="/tester/profile" element={<TesterProfile />} />
          <Route path="/tester-bugs" element={<TesterBugList />} />

          {/* 🧑‍💻 Developer */}
          <Route path="/bugs" element={<BugList />} />
          <Route
            path="/developer/profile"
            element={<DeveloperProfile />}
          />

          {/* 🐞 Bugs */}
          <Route
            path="/raise-bug/:project_id"
            element={<RaiseBug />}
          />
          <Route
            path="/bug/:bug_id"
            element={<BugOverview />}
          />
          <Route
            path="/bug/:id/chat"
            element={<BugChat />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
