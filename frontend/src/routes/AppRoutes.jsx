import { Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";
import Notes from "../pages/notes/Notes";
import Tasks from "../pages/tasks/Tasks";
import StudyPlanner from "../pages/study-planner/StudyPlanner";
import Groups from "../pages/groups/Groups";
import Chat from "../pages/chat/Chat";
import AI from "../pages/ai/AI";
import Quiz from "../pages/quiz/Quiz";
import Profile from "../pages/profile/Profile";

import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Pages with Sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/study-planner" element={<StudyPlanner />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:groupId" element={<Chat />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
