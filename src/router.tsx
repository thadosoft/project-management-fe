import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage.tsx";
import ProjectPage from "@/pages/ProjectPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import TaskPage from "@/pages/TaskPage.tsx";
import ProfilePage from "@/pages/ProfilePage.tsx";
import ReferenceProfileDetail from "./components/reference-profile/ReferenceProfileDetail";

export const router = createBrowserRouter([
  // {path: "/", element: <App/>},
  { path: "/", element: <DashboardPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/project", element: <ProjectPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile/:id", element: <ReferenceProfileDetail /> },
  { path: "/project/task/:projectId", element: <TaskPage /> }
]);