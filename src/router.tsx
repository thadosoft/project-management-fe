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
import CreateMaterialPage from "./pages/material/materials/CreateMaterialPage";
import SearchMaterialPage from "./pages/material/materials/SearchMaterialPage";
import AttendancePage from "./pages/attendance/AttendancePage";
import CreateBOMPage from "./pages/ecommerce/CreateBOMPage";
import SearchBOMPage from "./pages/ecommerce/SearchBOMPage";
import CreateAttendancePage from "./pages/attendance/CreateAttendancePage";
import SearchAttandancePage from "./pages/attendance/SearchAttandancePage";
import AttendancePageMonthDetail from "./pages/attendance/AttendancePageMonthDetail";

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
  { path: "/create-attendance-sheet", element: <CreateAttendancePage /> },
  { path: "/search-attendance-sheet", element: <SearchAttandancePage /> },
  { path: "/attandance-month-detail/:id", element: <AttendancePageMonthDetail /> },
  
  // coordinate
  { path: "/project", element: <ProjectPage /> },
  { path: "/project/task/:projectId", element: <TaskPage /> },

  // reference profile
  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile/:id", element: <ReferenceProfileDetail /> },

  // material
  { path: "/create-material-categories", element: <CreateMaterialCategoryPage /> },
  { path: "/create-material", element: <CreateMaterialPage /> },
  { path: "/search-material", element: <SearchMaterialPage /> },

  // business
  { path: "/create-bom", element: < CreateBOMPage /> },
  { path: "/update-bom/:id", element: < CreateBOMPage /> },
  { path: "/search-bom", element: < SearchBOMPage /> },

]);