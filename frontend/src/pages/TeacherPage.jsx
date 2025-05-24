import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
import TeacherHeader from "../components/teacher/TeacherHeader";
import TeacherCourses from "../components/teacher/TeacherCourses";
import TeacherStudents from "../components/teacher/TeacherStudents";
import TeacherTaskList from "../components/teacher/TeacherTaskList";
import TeacherMessages from "../components/teacher/TeacherMessages";
import CreateCourseForm from "../components/forms/CreateCourseForm";

const TeacherPage = () => {
  const [activeSection, setActiveSection] = useState("mis-cursos");
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUserData(storedUser);
  }, []);

  if (!userData?.token || ![].concat(userData.roles).includes("TEACHER")) {
    return <p className="text-center text-danger mt-5">Acceso denegado.</p>;
  }

  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row>
        <Col xs={2} className="bg-dark text-white p-0">
          <TeacherSidebar setActiveSection={setActiveSection} />
        </Col>

        <Col md={10} className="p-4">
          <TeacherHeader />

          <Row className="align-items-start mt-3">
            <Col md={10}>
              {activeSection === "inicio" && <h3>Bienvenido al Panel</h3>}
              {activeSection === "mis-cursos" && <TeacherCourses />}
              {activeSection === "mis-alumnos" && <TeacherStudents />}
              {activeSection === "tareas-entregadas" && (
                <TeacherTaskList teacherUsername={userData.username} />
              )}
              {activeSection === "mensajes" && <TeacherMessages />}
            </Col>

            <Col md={2}>
              <div className="d-flex justify-content-end">
                <Button variant="success" onClick={() => setShowModal(true)}>
                  Crear Curso
                </Button>
              </div>
            </Col>
          </Row>

          {/* Modal con el formulario paracrear un curso */}
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Crear un nuevo curso</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CreateCourseForm onSuccess={() => setShowModal(false)} />
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherPage;
