import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import UserTable from "../components/admin/UserTable";
import AdminStats from "../components/admin/AdminStats"; 
import ActiveCourses from "../components/admin/ActiveCourses";
import PendingCourses from "../components/admin/PendingCourses";
import AllCourses from "../components/admin/AllCourses";
import "../styles/admin/AdminPanel.css";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("cursos-activos");
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

  if (!userData?.token || ![].concat(userData.roles).includes("ADMIN")) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h3 className="text-danger">Acceso denegado</h3>
          <p className="text-muted">Debes iniciar sesión como administrador.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
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
      <div className={`admin-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <AdminSidebar 
          setActiveSection={setActiveSection} 
          activeSection={activeSection}
          onItemClick={closeSidebar}
        />
      </div>

      {/* Contenido principal */}
      <div className="admin-main-content">
        <Container fluid className="p-4">
          <AdminHeader name={userData?.name || "Administrador"} />

          {/* Contenido de las secciones */}
          <div className="section-container">
            {activeSection === "estadisticas" && <AdminStats />}
            {activeSection === "todos-los-usuarios" && <UserTable />}
            {activeSection === "todos-los-cursos" && <AllCourses />}
            {activeSection === "cursos-activos" && <ActiveCourses />}
            {activeSection === "cursos-pendientes" && <PendingCourses />}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AdminPage;