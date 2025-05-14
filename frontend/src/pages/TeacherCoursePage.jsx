import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import TeacherCourseHeader from "../components/teacher/course/TeacherCourseHeader";
import TeacherCourseSidebar from "../components/teacher/course/TeacherCourseSidebar";
import TeacherCourseStudents from "../components/teacher/course/TeacherCourseStudents";
import TeacherCourseMaterial from "../components/teacher/course/TeacherCourseMaterial";
import TeacherCourseActivities from "../components/teacher/course/TeacherCourseActivities";
import { fetchWithAuth } from "../api/api";

const TeacherCoursePage = () => {
  const { id } = useParams(); // obtiene el id del curso desde la URL
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await fetchWithAuth(`/teacher/course/${id}`);
        setCourse(data); // suponiendo que es un único objeto, no un array
      } catch (error) {
        console.error("Error al cargar el curso:", error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return <p className="p-4">Cargando información del curso...</p>;
  }

  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row>
        <Col xs={2} className="bg-dark text-white p-0">
          <TeacherCourseSidebar />
        </Col>
        <Col xs={10} className="p-4">
          <TeacherCourseHeader course={course} />
          <TeacherCourseStudents courseId={id} />
          <TeacherCourseMaterial courseId={id} />
          <TeacherCourseActivities courseId={id} />
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherCoursePage;
