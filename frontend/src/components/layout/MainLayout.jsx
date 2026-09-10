import { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";
import { useAuth } from "../../hooks/useAuth";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/notes": "My Notes",
  "/tasks": "My Tasks",
  "/study-planner": "Study Planner",
  "/groups": "Study Groups",
  "/chat": "Group Chat",
  "/ai": "AI Assistant",
  "/quiz": "Quiz",
  "/profile": "My Profile",
};

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:ml-64 min-h-screen">
        <Navbar
          title={pageTitles[location.pathname] || "StudyAI"}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
