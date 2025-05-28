import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import TeacherCourseHeader from "../components/teacher/course/TeacherCourseHeader";
import TeacherCourseSidebar from "../components/teacher/course/TeacherCourseSidebar";
import TeacherCourseStudents from "../components/teacher/course/TeacherCourseStudents";
import TeacherCourseMaterial from "../components/teacher/course/TeacherCourseMaterial";
import TeacherCourseActivities from "../components/teacher/course/TeacherCourseActivities";
import AddMaterialForm from "../components/forms/AddMaterialForm";
import CreateActivityForm from "../components/forms/CreateActivityForm";
import { fetchWithAuth } from "../api/api";

const TeacherCoursePage = () => {
  const { id } = useParams(); // obtiene el id del curso desde la URL
  const [course, setCourse] = useState(null);
  const [activeSection, setActiveSection] = useState("students");
  const [refreshMaterials, setRefreshMaterials] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await fetchWithAuth(`/teacher/course/${id}`);
        setCourse(data);
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
          <TeacherCourseSidebar setActiveSection={setActiveSection} />
        </Col>

        <Col xs={10} className="p-4">
          <TeacherCourseHeader course={course} />

          <Row className="mb-3">
            <Col className="text-end">
              <Button
                variant="primary"
                className="me-2"
                onClick={() => setShowAddMaterialModal(true)}
              >
                Añadir Material
              </Button>
              <Button
                variant="warning"
                onClick={() => setShowCreateActivityModal(true)}
              >
                Crear Nueva Actividad
              </Button>
            </Col>
          </Row>

          {activeSection === "students" && (
            <TeacherCourseStudents courseId={id} />
          )}

          {activeSection === "material" && (
            <TeacherCourseMaterial
              courseId={id}
              refresh={refreshMaterials}
              onRefreshHandled={() => setRefreshMaterials(false)}
            />
          )}

          {activeSection === "create-task" && (
            <TeacherCourseActivities courseId={id} />
          )}
        </Col>
      </Row>

      {/* Modal para añadir material */}
      <Modal
        show={showAddMaterialModal}
        onHide={() => setShowAddMaterialModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddMaterialForm
            courseId={id}
            onMaterialUploaded={() => {
              setShowAddMaterialModal(false); // Cierra modal al subir
              setActiveSection("material"); // Muestra lista de material actualizada
              setRefreshMaterials(true); // Refresca lista
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Modal para crear una tarea */}
      <Modal
        show={showCreateActivityModal}
        onHide={() => setShowCreateActivityModal(false)} // Cerrar modal
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear Actividad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateActivityForm
            courseId={id}
            onActivityCreated={() => {
              setShowCreateActivityModal(false); // Cerrar modal al crear actividad
              setActiveSection("activities"); // Si quieres cambiar a la sección de actividades
            }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TeacherCoursePage;
