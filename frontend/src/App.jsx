import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage"; 
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";
import StudentCoursePage from "./pages/StudentCoursePage";
import TeacherCoursePage from "./pages/TeacherCoursePage";
import StudentTaskDelivery from "./components/student/course/StudentTaskDelivery";
import StudentTestAttempt from "./components/student/course/StudentTestAttempt.jsx";

// Importar las nuevas páginas de cursos
import IntensiveCourse from "./pages/IntensiveCourse";
import FlexibleCourse from "./pages/FlexibleCourse";
import GroupCourse from "./pages/GroupCourse";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          {/* pagina principal */}
          <Route path="/" element={<HomePage />} />

          {/* autenticacion */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} /> 

          {/* Nuevas rutas para las páginas de cursos */}
          <Route path="/course/intensive" element={<IntensiveCourse />} />
          <Route path="/course/flexible" element={<FlexibleCourse />} />
          <Route path="/course/group" element={<GroupCourse />} />

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

          {/* Ruta para el test del estudiante */}
          <Route
            path="/student/course/:courseId/test/:activityId"
            element={<StudentTestAttempt />}
          />

          {/* Ruta para la tarea del estudiante */}
          <Route
            path="/student/course/:courseId/task/:activityId"
            element={<StudentTaskDelivery />}
          />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;