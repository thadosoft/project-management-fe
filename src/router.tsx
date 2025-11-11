import { createBrowserRouter } from "react-router-dom"
import DashboardPage from "@/pages/DashboardPage.tsx"
import ProjectPage from "@/pages/ProjectPage.tsx"
import LoginPage from "@/pages/LoginPage.tsx"
import TaskPage from "@/pages/TaskPage.tsx"
import ProfilePage from "@/pages/ProfilePage.tsx"
import ReferenceProfileDetail from "./components/reference-profile/ReferenceProfileDetail"
import CreateEmployeePage from "./pages/Employee/CreateEmployeePage"
import SearchEmployeePage from "./pages/Employee/SearchEmployeePage"
import DetailEmployeePage from "./pages/Employee/DetailEmployeePage"
import CreateMaterialCategoryPage from "./pages/material/catergories/CreateMaterialCategoryPage"
import CreateMaterialPage from "./pages/material/materials/CreateMaterialPage"
import SearchMaterialPage from "./pages/material/materials/SearchMaterialPage"
import AttendancePage from "./pages/attendance/AttendancePage"
import CreateBOMPage from "./pages/ecommerce/CreateBOMPage"
import SearchBOMPage from "./pages/ecommerce/SearchBOMPage"
import CreateAttendancePage from "./pages/attendance/CreateAttendancePage"
import SearchAttandancePage from "./pages/attendance/SearchAttandancePage"
import AttendancePageMonthDetail from "./pages/attendance/AttendancePageMonthDetail"
import WarehouseEntryPage from "./pages/warehouse/WarehouseEntryPage"
import SearchWarehousePage from "./pages/warehouse/SearchWarehousePage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import WhiteBoardPage from "./pages/whiteboard/WhiteBoardPage"
import AuditLogPage from "./pages/AuditLog/ẠuditLogPage"
import DashboardTechnical from "./components/ui/DashboardTechnical"
import EmployeeOfMonthPage from "./pages/employee-of-month-page"
import WarehouseOutryPage from "./pages/warehouse/WarehouseOutryPage"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import BookStatisticsPage from "./pages/book/BookStatisticsPage"
import Book from "./pages/book/Book"
import EventPage from "./pages/event/EventPage"

export const router = createBrowserRouter(
  [
    // {path: "/", element: <App/>},
    { path: "/", element: <LoginPage /> },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ),
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/forgot-password", element: <ForgotPasswordPage /> },

    // hrm
    {
      path: "/create-employee",
      element: (
        <ProtectedRoute>
          <CreateEmployeePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/detail-employee/:id",
      element: (
        <ProtectedRoute>
          <DetailEmployeePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/search-employee",
      element: (
        <ProtectedRoute>
          <SearchEmployeePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/attendance-sheet",
      element: (
        <ProtectedRoute>
          <AttendancePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/create-attendance-sheet",
      element: (
        <ProtectedRoute>
          <CreateAttendancePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/search-attendance-sheet",
      element: (
        <ProtectedRoute>
          <SearchAttandancePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/attandance-month-detail/:id",
      element: (
        <ProtectedRoute>
          <AttendancePageMonthDetail />
        </ProtectedRoute>
      ),
    },

    // coordinate
    {
      path: "/project",
      element: (
        <ProtectedRoute>
          <ProjectPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/project/task/:projectId",
      element: (
        <ProtectedRoute>
          <TaskPage />
        </ProtectedRoute>
      ),
    },

    // reference profile
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/:id",
      element: (
        <ProtectedRoute>
          <ReferenceProfileDetail />
        </ProtectedRoute>
      ),
    },

    // material
    {
      path: "/create-material-categories",
      element: (
        <ProtectedRoute>
          <CreateMaterialCategoryPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/create-material",
      element: (
        <ProtectedRoute>
          <CreateMaterialPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/search-material",
      element: (
        <ProtectedRoute>
          <SearchMaterialPage />
        </ProtectedRoute>
      ),
    },

    // business
    { path: "/create-bom", element: <CreateBOMPage /> },
    { path: "/update-bom/:id", element: <CreateBOMPage /> },
    { path: "/search-bom", element: <SearchBOMPage /> },

    // kho
    {
      path: "/warehouse-entry",
      element: (
        <ProtectedRoute>
          <WarehouseEntryPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/warehouse-outry",
      element: (
        <ProtectedRoute>
          <WarehouseOutryPage />
        </ProtectedRoute>
      ),
    },

    {
      path: "/search-warehouse",
      element: (
        <ProtectedRoute>
          <SearchWarehousePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/warehouse-update/:id",
      element: (
        <ProtectedRoute>
          <WarehouseEntryPage />
        </ProtectedRoute>
      ),
    },

    //whiteboard
    {
      path: "/white-boards",
      element: (
        <ProtectedRoute>
          <WhiteBoardPage />
        </ProtectedRoute>
      ),
    },

    //audit-log
    {
      path: "/audit-log",
      element: (
        <ProtectedRoute>
          <AuditLogPage />
        </ProtectedRoute>
      ),
    },

    //technical-dash
    {
      path: "/technical-dashboard",
      element: (
        <ProtectedRoute>
          <DashboardTechnical />
        </ProtectedRoute>
      ),
    },

    {
      path: "/employee-of-month",
      element: (
        <ProtectedRoute>
          <EmployeeOfMonthPage />
        </ProtectedRoute>
      ),
    },
    // library
    {
      path: "/book-statistics",
      element: (
        <ProtectedRoute>
          <BookStatisticsPage />
        </ProtectedRoute>
      ),
    },

    {
      path: "/book",
      element: (
        <ProtectedRoute>
          <Book/>
        </ProtectedRoute>
      ),
    },

    // Event
    {
      path: "/event",
      element: (
        <ProtectedRoute>
          <EventPage/>
        </ProtectedRoute>
      ),
    }

   
  ],
  { basename: "/" },
)
