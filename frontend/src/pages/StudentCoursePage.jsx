import React, { useState } from "react";
import { useParams } from "react-router-dom";
import StudentCourseHeader from "../components/student/course/StudentCourseHeader";
import StudentCourseMaterial from "../components/student/course/StudentCourseMaterial";
import StudentCourseActivities from "../components/student/course/StudentCourseActivities";
import StudentCourseSidebar from "../components/student/course/StudentCourseSidebar";
import "./StudentCoursePage.css";

const StudentCoursePage = () => {
  const { id } = useParams();
  // Cambiar el estado por defecto a "activities"
  const [activeSection, setActiveSection] = useState("activities");

  // Función para renderizar el contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case "material":
        return (
          <div className="single-section-content">
            <div className="course-card material-card">
              <div className="card-header">
                <h3 className="card-title">📚 Material del Curso</h3>
                <p className="card-subtitle">Recursos y contenido disponible</p>
              </div>
              <div className="card-content">
                <StudentCourseMaterial courseId={id} />
              </div>
            </div>
          </div>
        );
      
      case "activities":
      default:
        return (
          <div className="single-section-content">
            <div className="course-card activities-card">
              <div className="card-header">
                <h3 className="card-title">✏️ Actividades</h3>
                <p className="card-subtitle">Tareas y evaluaciones pendientes</p>
              </div>
              <div className="card-content">
                <StudentCourseActivities courseId={id} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="student-course-layout">
      {/* Sidebar */}
      <div className="course-sidebar">
        <StudentCourseSidebar 
          setActiveSection={setActiveSection}
          activeSection={activeSection}
        />
      </div>

      {/* Main Content */}
      <div className="course-main-content">
        {/* Header del curso */}
        <div className="course-header-section">
          <div className="course-header-container">
            <StudentCourseHeader courseId={id} />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="course-body">
          <div className="course-body-container">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursePage;