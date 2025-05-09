import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
import TeacherHeader from "../components/teacher/TeacherHeader";
import TeacherDashboard from "../components/teacher/TeacherDashboard";

const TeacherPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row>
        <Col xs={2} className="bg-dark text-white p-0">
          <TeacherSidebar />
        </Col>
        <Col xs={10} className="p-4">
          <TeacherHeader />
          <TeacherDashboard name={user?.name || "Profesor"} />
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherPage;
