import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage.tsx";
import ProjectPage from "@/pages/ProjectPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import TaskPage from "@/pages/TaskPage.tsx";
import ProfilePage from "@/pages/ProfilePage.tsx";
import ReferenceProfileDetail from "./components/reference-profile/ReferenceProfileDetail";
import CreateEmployeePage from "./pages/Employee/CreateEmployeePage";
import SearchEmployeePage from "./pages/Employee/SearchEmployeePage";
import DetailEmployeePage from "./pages/Employee/DetailEmployeePage";
import CreateMaterialCategoryPage from "./pages/material/catergories/CreateMaterialCategoryPage";
import SearchMaterialCategoryPage from "./pages/material/catergories/SearchMaterialCategoryPage";
import CreateMaterialPage from "./pages/material/materials/CreateMaterialPage";
import SearchMaterialPage from "./pages/material/materials/SearchMaterialPage";
import AttendancePage from "./pages/AttendancePage";
import CreateBOMPage from "./pages/ecommerce/CreateBOMPage";

export const router = createBrowserRouter([
  // {path: "/", element: <App/>},
  { path: "/", element: <LoginPage /> },
  { path: "/home", element: <DashboardPage /> },
  { path: "/login", element: <LoginPage /> },

  // hrm
  { path: "/create-employee", element: <CreateEmployeePage /> },
  { path: "/detail-employee/:id", element: <DetailEmployeePage /> },
  { path: "/search-employee", element: <SearchEmployeePage /> },
  { path: "/attendance-sheet", element: <AttendancePage /> },

  // coordinate
  { path: "/project", element: <ProjectPage /> },
  { path: "/project/task/:projectId", element: <TaskPage /> },

  // reference profile
  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile/:id", element: <ReferenceProfileDetail /> },

  // material
  { path: "/create-material-categories", element: <CreateMaterialCategoryPage /> },
  { path: "/search-material-categories", element: <SearchMaterialCategoryPage /> },
  { path: "/create-material", element: <CreateMaterialPage /> },
  { path: "/search-material", element: <SearchMaterialPage /> },

  // business
  { path: "/create-bom", element: < CreateBOMPage /> }

]);