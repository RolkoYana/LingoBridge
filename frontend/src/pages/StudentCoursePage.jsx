import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FaHome } from "react-icons/fa";
import StudentCourseHeader from "../components/student/course/StudentCourseHeader";
import StudentCourseMaterial from "../components/student/course/StudentCourseMaterial";
import StudentCourseActivities from "../components/student/course/StudentCourseActivities";

const StudentCoursePage = () => {
  const { id } = useParams(); // obtiene el ID desde la URL
  const navigate = useNavigate(); 

  const goToStudentPage = () => {
    navigate("/student"); // Redirige a la página de cursos
  };

  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row className="justify-content-between align-items-center mb-4">
        {/* Columna para el Header - Curso y Profesor, más ancha */}
        <Col xs={10} md={10} className="p-0">
          <StudentCourseHeader courseId={id} />
        </Col>

        {/* Columna para el ícono de Home, más estrecha */}
        <Col xs={2} md={2} className="text-end">
          <FaHome
            size={40} // Aumentamos el tamaño del ícono
            style={{ cursor: "pointer", color: "#007bff" }} // Ajustamos el color
            onClick={goToStudentPage} // Redirige a la página de cursos
          />
        </Col>
      </Row>

      <Row>
        {/* Contenido principal */}
        <Col xs={12} className="p-4">
          <Row className="d-flex justify-content-between">
            <Col xs={12} md={6} className="mb-4">
              <StudentCourseMaterial courseId={id} />
            </Col>
            <Col xs={12} md={6}>
              <StudentCourseActivities courseId={id} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentCoursePage;
