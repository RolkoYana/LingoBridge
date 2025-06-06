import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
import TeacherHeader from "../components/teacher/TeacherHeader";
import TeacherCourses from "../components/teacher/TeacherCourses";
import TeacherStudents from "../components/teacher/TeacherStudents";
import TeacherTaskList from "../components/teacher/TeacherTaskList";
import TeacherMessages from "../components/teacher/TeacherMessages";
import "./TeacherPage.css";

const TeacherPage = () => {
  const [activeSection, setActiveSection] = useState("mis-cursos");
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
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

  if (!userData?.token || ![].concat(userData.roles).includes("TEACHER")) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h3 className="text-danger">Acceso denegado</h3>
          <p className="text-muted">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-panel-container">
      {/* Botón menú móvil - solo hamburguesa */}
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
      <div className={`teacher-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <TeacherSidebar 
          setActiveSection={setActiveSection} 
          activeSection={activeSection}
          onItemClick={closeSidebar}
        />
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        <Container fluid className="p-4">
          <TeacherHeader />

          <div className="mt-3">
            {activeSection === "inicio" && (
              <div className="content-card p-4">
                <h3>Bienvenido al Panel del Profesor</h3>
                <p className="text-muted">
                  Selecciona una opción del menú lateral para comenzar.
                </p>
              </div>
            )}
            {activeSection === "mis-cursos" && <TeacherCourses />}
            {activeSection === "mis-alumnos" && <TeacherStudents />}
            {activeSection === "tareas-entregadas" && (
              <TeacherTaskList teacherUsername={userData.username} />
            )}
            {activeSection === "mensajes" && <TeacherMessages />}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default TeacherPage;