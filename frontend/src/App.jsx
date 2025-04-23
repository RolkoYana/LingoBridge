import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Courses from "./pages/Courses";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Pagina principal */}
        <Route path="/" element={<HomePage />} />

        {/* Autenticacion */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Panel de admin */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Pagina de curso */}
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </Router>
  );
}

export default App;
