import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";
import StudentCoursePage from "./pages/StudentCoursePage";
import TeacherCoursePage from "./pages/TeacherCoursePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* pagina principal */}
        <Route path="/" element={<HomePage />} />

        {/* autenticacion */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* panel de admin */}
        <Route path="/admin" element={<AdminPage />} />

        {/* panel de estudiante */}
        <Route path="/student" element={<StudentPage />} />

        {/* panel de profesor */}
        <Route path="/teacher" element={<TeacherPage />} />

        {/* pagina de curso para alumno*/}
        <Route path="/student/course/:id" element={<StudentCoursePage />} />

        {/* pagina de curso para profesor */}
        <Route path="/teacher/course/:id" element={<TeacherCoursePage />} />
      </Routes>
    </Router>
  );
}

export default App;
