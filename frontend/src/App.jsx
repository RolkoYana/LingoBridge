import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import LoginAdmin from "./pages/admin/LoginAdmin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CoursesManagement from "./pages/admin/CoursesManagement";
import TeachersManagement from "./pages/admin/TeachersManagement";

function App() {
  return (
    <Router>
      <Routes>
        {/* rutas publicas */}
        <Route path="/" element={<Home />} />
        <Route path="/cpurses" element={<Courses />} />

        {/* rutas de admin */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<CoursesManagement />} />
        <Route path="/admin/teachers" element={<TeachersManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
