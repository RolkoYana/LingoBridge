import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import TeacherCourseHeader from "../components/teacher/course/TeacherCourseHeader";
import TeacherCourseSidebar from "../components/teacher/course/TeacherCourseSidebar";
import TeacherCourseStudents from "../components/teacher/course/TeacherCourseStudents";
import TeacherCourseMaterial from "../components/teacher/course/TeacherCourseMaterial";
import TeacherCourseActivities from "../components/teacher/course/TeacherCourseActivities";

const TeacherCoursePage = () => {
  const id = useParams(); // obtiene id del curso desde la url

  console.log("ID del curso recibido: ", id); // depuracion
  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row>
        <Col xs={2} className="bg-dark text-white p-0">
          <TeacherCourseSidebar />
        </Col>
        <Col xs={10} className="p-4">
          <TeacherCourseHeader courseId={id} />
          <TeacherCourseStudents courseId={id} />
          <TeacherCourseMaterial courseId={id} />
          <TeacherCourseActivities courseId={id} />
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherCoursePage;
