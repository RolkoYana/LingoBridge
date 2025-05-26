import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import UserTable from "../components/admin/UserTable";
import AdminStats from "../components/admin/AdminStats"; 
import ActiveCourses from "../components/admin/ActiveCourses";
import PendingCourses from "../components/admin/PendingCourses";
import AllCourses from "../components/admin/AllCourses";

import "../styles/AdminPanel.css"; 

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("cursos-activos"); // cursos activos se ven por defecto al entral al panel de admin 
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    setUserData(storedUser);
  }, []);

  if (!userData?.token || ![].concat(userData.roles).includes("ADMIN")) {
    return (
      <p className="text-center text-danger mt-5">
        Acceso denegado. Debes iniciar sesión como administrador.
      </p>
    );
  }

  return (
    <div className="admin-dashboard-wrapper d-flex flex-column min-vh-100">
      <AdminHeader /> 

      <Container fluid className="flex-grow-1 p-0"> 
        <Row className="g-0"> 
          <Col xs={12} md={3} lg={2} className="sidebar-col p-0"> 
            <AdminSidebar setActiveSection={setActiveSection} activeSection={activeSection} />
          </Col>

          <Col xs={12} md={9} lg={10} className="main-content-col p-3"> 
            {activeSection === "estadisticas" && <AdminStats />}
            {activeSection === "todos-los-usuarios" && <UserTable />}
            {activeSection === "todos-los-cursos" && <AllCourses />}
            {activeSection === "cursos-activos" && <ActiveCourses />}
            {activeSection === "cursos-pendientes" && <PendingCourses />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminPage;