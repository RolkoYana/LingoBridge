import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
import TeacherHeader from "../components/teacher/TeacherHeader";
import TeacherCourses from "../components/teacher/TeacherCourses";
import TeacherStudents from "../components/teacher/TeacherStudents";
import TeacherMaterials from "../components/teacher/TeacherMaterials";
import TeacherEvaluations from "../components/teacher/TeacherEvaluations";
import TeacherMessages from "../components/teacher/TeacherMessages";

const TeacherPage = () => {
  const [activeSection, setActiveSection] = useState("mis-cursos");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Usuario cargado desde localStorage:", storedUser);

    setUserData(storedUser);
  }, []);

  console.log("userData antes de la validación:", userData);
  console.log("Roles antes de la validación:", userData?.roles);
  console.log("Es un array?:", Array.isArray(userData?.roles));

  if (!userData?.token || ![].concat(userData.roles).includes("TEACHER")) {
    return (
      <p className="text-center text-danger mt-5">
        Acceso denegado. Debes iniciar sesión como profesor.
      </p>
    );
  }

  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row>
        <Col xs={2} className="bg-dark text-white p-0">
          <TeacherSidebar setActiveSection={setActiveSection} />
        </Col>
        <Col md={9} className="p-4">
          <TeacherHeader />

          {/* Renderizar sección activa según lo seleccionado en el sidebar */}
          {activeSection === "inicio" && (
            <h3>Bienvenido all Panel de Profesor</h3>
          )}
          {activeSection === "mis-cursos" && <TeacherCourses />}
          {activeSection === "mis-alumnos" && <TeacherStudents />}
          {activeSection === "material" && <TeacherMaterials />}
          {activeSection === "evaluaciones" && <TeacherEvaluations />}
          {activeSection === "mensajes" && <TeacherMessages />}
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherPage;
