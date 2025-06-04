import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { FaPlus, FaTasks } from "react-icons/fa";
import TeacherCourseHeader from "../components/teacher/course/TeacherCourseHeader";
import TeacherCourseSidebar from "../components/teacher/course/TeacherCourseSidebar";
import TeacherCourseStudents from "../components/teacher/course/TeacherCourseStudents";
import TeacherCourseMaterial from "../components/teacher/course/TeacherCourseMaterial";
import TeacherCourseActivities from "../components/teacher/course/TeacherCourseActivities";
import AddMaterialForm from "../components/forms/AddMaterialForm";
import CreateActivityForm from "../components/forms/CreateActivityForm";
import { fetchWithAuth } from "../api/api";
import "./TeacherCoursePage.css";

const TeacherCoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeSection, setActiveSection] = useState("students");
  const [refreshMaterials, setRefreshMaterials] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await fetchWithAuth(`/teacher/course/${id}`);
        setCourse(data);
      } catch (error) {
        console.error("Error al cargar el curso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="teacher-course-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando información del curso...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="teacher-course-error">
        <h4>Error al cargar el curso</h4>
        <p>No se pudo encontrar la información del curso solicitado.</p>
      </div>
    );
  }

  return (
    <div className="teacher-course-page">
      <Container fluid className="h-100">
        <Row className="h-100">
          {/* Sidebar */}
          <Col xs={12} md={3} lg={2} className="teacher-sidebar-col">
            <TeacherCourseSidebar 
              setActiveSection={setActiveSection} 
              activeSection={activeSection}
            />
          </Col>

          {/* Contenido principal */}
          <Col xs={12} md={9} lg={10} className="teacher-main-content">
            {/* Header del curso */}
            <TeacherCourseHeader course={course} />

            {/* Botones de acción */}
            <div className="teacher-actions-bar">
              <Row className="align-items-center">
                <Col>
                  <h5 className="section-title mb-0">
                    {activeSection === "students" && "Estudiantes"}
                    {activeSection === "material" && "Material del Curso"}
                    {activeSection === "create-task" && "Actividades"}
                  </h5>
                </Col>
                <Col xs="auto">
                  <div className="action-buttons">
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => setShowAddMaterialModal(true)}
                    >
                      <FaPlus className="me-1" />
                      <span className="d-none d-sm-inline">Añadir Material</span>
                      <span className="d-sm-none">Material</span>
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => setShowCreateActivityModal(true)}
                    >
                      <FaTasks className="me-1" />
                      <span className="d-none d-sm-inline">Nueva Actividad</span>
                      <span className="d-sm-none">Actividad</span>
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Contenido de las secciones */}
            <div className="teacher-section-content">
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
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal para añadir material */}
      <Modal
        show={showAddMaterialModal}
        onHide={() => setShowAddMaterialModal(false)}
        centered
        size="lg"
        className="teacher-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPlus className="me-2" />
            Añadir Material
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddMaterialForm
            courseId={id}
            onMaterialUploaded={() => {
              setShowAddMaterialModal(false);
              setActiveSection("material");
              setRefreshMaterials(true);
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Modal para crear actividad */}
      <Modal
        show={showCreateActivityModal}
        onHide={() => setShowCreateActivityModal(false)}
        centered
        size="lg"
        className="teacher-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaTasks className="me-2" />
            Crear Nueva Actividad
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateActivityForm
            courseId={id}
            onActivityCreated={() => {
              setShowCreateActivityModal(false);
              setActiveSection("create-task");
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TeacherCoursePage;