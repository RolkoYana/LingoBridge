import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import UserTable from "../components/admin/UserTable";
import CourseTable from "../components/admin/CourseTable";
import AdminStats from "../components/admin/AdminStats";
import ApproveCourse from "../components/admin/ApproveCourse";
import AssignCourse from "../components/admin/AssignCourse";
import FinalizeCourse from "../components/admin/FinalizeCourse";
import { useState } from "react";

const AdminPage = () => {
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  console.log("Datos del usuario en localStorage:", userData);

  if (!userData || !userData.token || !userData.roles.includes("ADMIN")) {
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
          <AdminSidebar />
        </Col>
        <Col xs={10} className="p-3">
          <AdminHeader />
          <UserTable />
          <CourseTable onSelectCourse={setSelectedCourseId} />
          <AdminStats />
          <ApproveCourse /> {/* panel de cursos pendientes de aprobar */}
          {/* solo muestra asignacion y finalizacion si hay un curso seleccionado */}
          {selectedCourseId && (
            <>
              <h3>Gestionando Cursi ID: {selectedCourseId}</h3>
              <AssignCourse courseId={selectedCourseId} />
              <FinalizeCourse courseId={selectedCourseId} />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
