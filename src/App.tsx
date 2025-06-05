import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage.tsx"; 
import ForgotPasswordPage from "@/pages/ForgotPasswordPage.tsx"; 
import DashboardPage from "./pages/DashboardPage";
import ProjectPage from "./pages/ProjectPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/home" element={<DashboardPage />} />
        <Route path="/project" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;