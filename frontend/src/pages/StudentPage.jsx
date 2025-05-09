import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import StudentSidebar from "../components/student/StudentSidebar";
import StudentHeader from "../components/student/StudentHeader";
import StudentCourses from "../components/student/StudentCourses";
import StudentActivities from "../components/student/StudentActivities";

const StudentPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row>
        <Col xs={2} className="bg-dark text-white p-0">
          <StudentSidebar />
        </Col>
        <Col xs={10} className="p-4">
          <StudentHeader name={user?.name || "Estudiante"} />
          <Row>
            <Col md={8}>
              <StudentCourses />
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
