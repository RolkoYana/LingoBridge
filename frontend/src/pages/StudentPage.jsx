import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import StudentSidebar from "../components/student/StudentSidebar";
import StudentHeader from "../components/student/StudentHeader";
import StudentCourses from "../components/student/StudentCourses";
import StudentActivities from "../components/student/StudentActivities";
import StudentEvaluations from "../components/student/StudentEvaluations";
import StudentMessages from "../components/student/StudentMessages";
import AvailableCourses from "../components/student/StudentAvailableCourses";

const StudentPage = () => {
  const [activeSection, setActiveSection] = useState("mis-cursos");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Usuario cargado desde localStorage:", storedUser);

    setUserData(storedUser);
  }, []);

  if (!userData?.token || ![].concat(userData.roles).includes("STUDENT")) {
    return (
      <p className="text-center text-danger mt-5">
        Acceso denegado. Debes iniciar sesión como estudiante.
      </p>
    );
  }

  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row>
        <Col xs={2} className="bg-dark text-white p-0">
          <StudentSidebar setActiveSection={setActiveSection} />
        </Col>

        <Col xs={10} className="p-4">
          <StudentHeader name={userData?.name || "Estudiante"} />

          <Row>
            <Col md={8}>
              {activeSection === "cursos-disponibles" && <AvailableCourses />}
              {activeSection === "mis-cursos" && <StudentCourses />}
              {activeSection === "evaluaciones" && <StudentEvaluations />}
              {activeSection === "chat" && <StudentMessages />}
            </Col>
            <Col md={4}>
              <StudentActivities />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentPage;
