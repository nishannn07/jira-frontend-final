// jiraboard_frontend-dev/src/App.jsx

"use client"

import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Navbar from "./Navbar"
import Login from "./Auth/Login"
import Signup from "./Auth/Signup"
import Dashboard from "./Dashboard"
import TaskBoard from "./TaskBoard"
import TaskForm from "./TaskForm"
import TaskList from "./TaskList"
import ProjectForm from "./ProjectForm"
import TeamForm from "./TeamForm"
import TaskDetails from "./TaskDetails"
import NavbarOUt from "./NavbarOut"
import About from "./About"
import UserOverview from "./UserOverview"
import ProTaskList from "./ProTaskList"
import UserLogs from "./UserLogs"
import KanbanBoard from "./KabanBoard"
import AdminDashboard from "./AdminDashboard"
import ManagerDashboard from "./ManagerDashboard"
import EpicForm from "./EpicForm"
import StoryForm from "./StoryForm"
import EpicList from "./EpicList"
import StoryList from "./StoryList"
import EpicDetails from "./EpicDetails"
import StoryDetails from "./StoryDetails"
import SuperAdminDashboard from "./SuperAdminDashboard" // 1. Import the new component

function App() {
  const [open, setOpen] = useState(false)
  const [auth, setAuth] = useState(sessionStorage.getItem("token") ? true : false)

  return (
    <>
      <Toaster position="top-right" />

      {auth ? <Navbar open={open} setOpen={setOpen} setAuth={setAuth} /> : <NavbarOUt />}
      <div className={`transition-all duration-300 ${auth ? (open ? "ml-64" : "ml-10") : ""}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<About />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/taskboard" element={auth ? <TaskBoard /> : <Navigate to="/" />} />
          <Route path="/taskform" element={auth ? <TaskForm /> : <Navigate to="/" />} />
          <Route path="/tasklist" element={auth ? <TaskList /> : <Navigate to="/" />} />
          <Route path="/projectform" element={auth ? <ProjectForm /> : <Navigate to="/" />} />
          <Route path="/teamform" element={auth ? <TeamForm /> : <Navigate to="/" />} />
          <Route path="/task/:taskId" element={auth ? <TaskDetails /> : <Navigate to="/" />} />
          <Route path="/epic/:epicId" element={auth ? <EpicDetails /> : <Navigate to="/" />} />
          <Route path="/story/:storyId" element={auth ? <StoryDetails /> : <Navigate to="/" />} />
          <Route path="/overview" element={auth ? <UserOverview /> : <Navigate to="/" />} />
          <Route path="/tasks" element={auth ? <ProTaskList /> : <Navigate to="/" />} />
          <Route path="/logs" element={auth ? <UserLogs /> : <Navigate to="/" />} />
          <Route path="/board" element={auth ? <KanbanBoard /> : <Navigate to="/" />} />
          <Route path="/epicform" element={auth ? <EpicForm /> : <Navigate to="/" />} />
          <Route path="/storyform" element={auth ? <StoryForm /> : <Navigate to="/" />} />
          <Route path="/epics" element={auth ? <EpicList /> : <Navigate to="/" />} />
          <Route path="/stories" element={auth ? <StoryList /> : <Navigate to="/" />} />

          {/* Admin Routes */}
          <Route path="/admin" element={auth ? <AdminDashboard /> : <Navigate to="/" />} />
          {/* 2. Add the new route for the super admin dashboard */}
          <Route path="/super-admin" element={auth ? <SuperAdminDashboard /> : <Navigate to="/" />} />


          {/* Manager Routes */}
          <Route path="/manager" element={auth ? <ManagerDashboard /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </>
  )
}

export default App