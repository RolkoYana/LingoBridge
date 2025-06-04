import React, { useEffect, useState } from "react";
import { Table, Button, Card, Modal, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye, FaUsers, FaGraduationCap } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";
import CreateCourseForm from "../forms/CreateCourseForm";
import "./TeacherCourses.css";

const TeacherCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth("/teacher/courses");
      console.log("Cursos obtenidos:", data);
      setCourses(data);
    } catch (error) {
      console.log("Error al obtener cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchCourses(); // Recargar la lista
  };

  const getTypeClass = (type) => {
    switch (type.toUpperCase()) {
      case 'INTENSIVO': return 'course-type-intensivo';
      case 'GRUPAL': return 'course-type-grupal';
      case 'FLEXIBLE': return 'course-type-flexible';
      default: return 'course-type-default';
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      'A1': '#28a745', 'A2': '#20c997',
      'B1': '#17a2b8', 'B2': '#007bff',
      'C1': '#6f42c1', 'C2': '#e83e8c'
    };
    return colors[level] || '#6c757d';
  };

  if (loading) {
    return (
      <Card className="content-card p-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando tus cursos...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="content-card p-4">
        {/* Header con título y botón */}
        <Row className="align-items-center mb-4">
          <Col>
            <div className="d-flex align-items-center">
              <FaGraduationCap size={24} className="text-primary me-3" />
              <div>
                <h3 className="mb-1">Mis Cursos</h3>
                <p className="text-muted mb-0">
                  {courses.length} curso{courses.length !== 1 ? 's' : ''} disponible{courses.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </Col>
          <Col xs="auto">
            <Button
              className="btn-create-course d-flex align-items-center"
              onClick={() => setShowCreateModal(true)}
              aria-label="Crear nuevo curso"
            >
              <FaPlus className="me-2" />
              Crear Curso
            </Button>
          </Col>
        </Row>

        {/* Tabla de cursos */}
        {courses.length > 0 ? (
          <div className="table-responsive">
            <Table className="modern-table" hover>
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Modalidad</th>
                  <th className="text-center">Alumnos</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td data-label="Curso">
                      <div className="course-info">
                        <div className="d-flex align-items-center mb-1">
                          <h6 className="mb-0 me-2">{course.name}</h6>
                          <Badge 
                            style={{ backgroundColor: getLevelColor(course.level) }}
                            className="level-badge"
                          >
                            {course.level}
                          </Badge>
                        </div>
                        <small className="text-muted">{course.description}</small>
                      </div>
                    </td>
                    <td data-label="Modalidad">
                      <span className={`course-type-badge ${getTypeClass(course.type)}`}>
                        {course.type.charAt(0).toUpperCase() + course.type.slice(1)}
                      </span>
                    </td>
                    <td data-label="Alumnos" className="text-center">
                      <div className="d-flex align-items-center justify-content-center">
                        <FaUsers className="text-muted me-1" size={14} />
                        <span className="fw-bold">{course.numberOfStudents}</span>
                      </div>
                    </td>
                    <td data-label="Acciones" className="text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="view-course-btn"
                        onClick={() => navigate(`/teacher/course/${course.id}`)}
                        aria-label={`Ver detalles del curso ${course.name}`}
                      >
                        <FaEye className="me-1" />
                        Ver Curso
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="empty-state text-center py-5">
            <FaGraduationCap size={64} className="text-muted mb-3" />
            <h5 className="text-muted">No tienes cursos creados</h5>
            <p className="text-muted mb-4">
              Comienza creando tu primer curso para gestionar estudiantes y actividades.
            </p>
            <Button
              className="btn-create-course"
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus className="me-2" />
              Crear mi primer curso
            </Button>
          </div>
        )}
      </Card>

      {/* Modal para crear curso */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
        className="create-course-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="d-flex align-items-center">
            <FaPlus className="text-success me-2" />
            Crear nuevo curso
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <CreateCourseForm onSuccess={handleCreateSuccess} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TeacherCourses;