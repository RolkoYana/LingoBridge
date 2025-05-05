import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import StudentCourseHeader from "../components/student/course/StudentCourseHeader";
import StudentCourseSidebar from "../components/student/course/StudentCourseSidebar";
import StudentCourseMaterial from "../components/student/course/StudentCourseMaterial";
import StudentCourseActivities from "../components/student/course/StudentCourseActivities";

const StudentCoursePage = () => {
  const { id } = useParams(); // obtiene el ID desde la URL

  console.log("ID del curso recibido:", id); // depuracion

  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row>
        {/* Sidebar */}
        <Col xs={2} className="bg-dark text-white p-0">
          <StudentCourseSidebar />
        </Col>

        {/* Contenido principal */}
        <Col xs={10} className="p-4">
          <StudentCourseHeader courseId={id} />
          <StudentCourseMaterial courseId={id} />
          <StudentCourseActivities courseId={id} />
        </Col>
      </Row>
    </Container>
  );
};

export default StudentCoursePage;
