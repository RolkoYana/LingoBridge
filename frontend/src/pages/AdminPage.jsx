import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import UserTable from "../components/admin/UserTable";
import AdminStats from "../components/admin/AdminStats";
import ActiveCourses from "../components/admin/ActiveCourses";
import PendingCourses from "../components/admin/PendingCourses";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("cursos-activos"); // se ve el apartado de cursos activos por defecto al entrar a la pagina de admin
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Usuario cargado desde localStorage:", storedUser);

    setUserData(storedUser);
  }, []);

  console.log("userData antes de la validación:", userData);
  console.log("Roles antes de la validación:", userData?.roles);
  console.log("Es un array?:", Array.isArray(userData?.roles));

  if (!userData?.token || ![].concat(userData.roles).includes("ADMIN")) {
    return (
      <p className="text-center text-danger mt-5">
        Acceso denegado. Debes iniciar sesión como administrador.
      </p>
    );
  }

  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row>
        <Col xs={2} className="bg-secondary text-white p-0">
          <AdminSidebar setActiveSection={setActiveSection} />{" "}
          {/* sidebar envía el estado */}
        </Col>
        <Col xs={10} className="p-3">
          <AdminHeader />

          {/* renderiza la sección correcta según `activeSection` */}
          {activeSection === "inicio" && (
            <h3>Bienvenido al Panel de Administración</h3>
          )}
          {activeSection === "cursos-activos" && <ActiveCourses />}
          {activeSection === "cursos-pendientes" && <PendingCourses />}
          {activeSection === "usuarios" && <UserTable />}
          {activeSection === "estadisticas" && <AdminStats />}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
