import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage.tsx"; 
import ForgotPasswordPage from "@/pages/ForgotPasswordPage.tsx"; 

const HomePage = () => <div>Home Page</div>;
const ProjectPage = () => <div>Project Page</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/project" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;