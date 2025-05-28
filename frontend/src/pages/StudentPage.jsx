import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import StudentSidebar from "../components/student/StudentSidebar";
import StudentHeader from "../components/student/StudentHeader";
import StudentCourses from "../components/student/StudentCourses";
import StudentEvaluations from "../components/student/StudentEvaluations";
import StudentMessages from "../components/student/StudentMessages";
import AvailableCourses from "../components/student/StudentAvailableCourses";
import "../styles/StudentPanel.css";

const StudentPage = () => {
  const [activeSection, setActiveSection] = useState("mis-cursos");
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Usuario cargado desde localStorage:", storedUser);
    setUserData(storedUser);
  }, []);

  // Manejar resize de ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (!userData?.token || ![].concat(userData.roles).includes("STUDENT")) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h3 className="text-danger">Acceso denegado</h3>
          <p className="text-muted">Debes iniciar sesión como estudiante.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-panel-container">
      {/* Botón menú móvil */}
      <button 
        className="mobile-menu-toggle d-md-none"
        onClick={toggleSidebar}
        style={{ display: sidebarOpen ? 'none' : 'block' }}
        aria-label="Abrir menú"
        aria-expanded={sidebarOpen}
      >
        <FaBars size={20} />
      </button>

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay d-md-none" 
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`student-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <StudentSidebar 
          setActiveSection={setActiveSection} 
          activeSection={activeSection}
          onItemClick={closeSidebar}
        />
      </div>

      {/* Contenido principal */}
      <div className="student-main-content">
        <Container fluid className="p-4">
          <StudentHeader name={userData?.name || "Estudiante"} />

          {/* Contenido de las secciones - sin sidebar de actividades */}
          <div className="section-container">
            {activeSection === "cursos-disponibles" && <AvailableCourses />}
            {activeSection === "mis-cursos" && <StudentCourses />}
            {activeSection === "evaluaciones" && <StudentEvaluations />}
            {activeSection === "chat" && <StudentMessages />}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default StudentPage;