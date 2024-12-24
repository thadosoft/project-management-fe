import {createBrowserRouter} from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage.tsx";
import ProjectPage from "@/pages/ProjectPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import TaskPage from "@/pages/TaskPage.tsx";

export const router = createBrowserRouter([
  // {path: "/", element: <App/>},
  {path: "/", element: <DashboardPage/>},
  {path: "/login", element: <LoginPage/>},
  {path: "/project", element: <ProjectPage/>},
  {path: "/task", element: <TaskPage/>}
]);