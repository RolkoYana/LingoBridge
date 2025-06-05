import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Row,
  Col,
  Spinner,
  Badge,
} from "react-bootstrap";
import {
  FaClock,
  FaSearch,
  FaSyncAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import ApproveCourse from "./ApproveCourse";
import RejectCourse from "./RejectCourse";
import { fetchWithAuth } from "../../api/api";

const PendingCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadCourses = () => {
    setLoading(true);
    fetchWithAuth("/admin/pending-courses")
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error al cargar cursos:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const removeCourse = (courseId) => {
    setCourses(courses.filter((c) => c.id !== courseId));
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.teacher &&
        `${course.teacher.name} ${course.teacher.surname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (course.user &&
        `${course.user.name} ${course.user.surname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="warning" />
          <p className="mt-3 text-muted">Cargando cursos pendientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="unified-section">
      {/* Header de la sección */}
      <div className="section-header">
        <Row className="align-items-center">
          <Col>
            <h2 className="section-title">
              <FaClock className="header-icon me-3" />
              Cursos Pendientes
            </h2>
            <p className="section-subtitle">
              Cursos esperando aprobación del administrador
            </p>
          </Col>
          <Col xs="auto">
            <Badge bg="warning" text="dark" className="px-4 py-2 fs-6">
              <FaExclamationTriangle className="me-2" />
              Total: {courses.length}
            </Badge>
          </Col>
        </Row>
      </div>

      {/* Contenido de la sección */}
      <div className="section-content">
        <div className="p-4">
          {/* Control de búsqueda */}
          <Row className="mb-4">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre, descripción o profesor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4} className="d-flex justify-content-end">
              <Button
                className="btn-admin-warning d-flex align-items-center gap-2"
                onClick={loadCourses}
              >
                <FaSyncAlt />
                Actualizar Lista
              </Button>
            </Col>
          </Row>

          {/* Tabla de cursos pendientes */}
          <div className="table-responsive">
            <Table className="admin-table mb-0">
              <thead>
                <tr>
                  <th width="80">
                    <FaClock className="me-1" />
                    ID
                  </th>
                  <th>Curso</th>
                  <th>Descripción</th>
                  <th>Profesor</th>
                  <th width="240">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <div className="empty-section">
                        <FaClock size={48} className="empty-icon" />
                        <h5 className="empty-title">
                          {searchTerm
                            ? "No se encontraron cursos pendientes"
                            : "No hay cursos pendientes"}
                        </h5>
                        <p className="empty-text">
                          {searchTerm
                            ? "No se encontraron cursos pendientes con el término de búsqueda"
                            : "Los cursos aparecerán aquí cuando los profesores los envíen para aprobación"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course.id}>
                      <td>
                        <div className="d-flex justify-content-center">
                          <div
                            className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "35px",
                              height: "35px",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >
                            {course.id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold text-warning">
                          {course.name}
                        </div>
                      </td>
                      <td>
                        <div>
                          {course.description && course.description.length > 100
                            ? `${course.description.substring(0, 100)}...`
                            : course.description || (
                                <em className="text-muted">Sin descripción</em>
                              )}
                        </div>
                      </td>
                      <td>
                        {course.teacher ? (
                          <div>
                            <div className="fw-medium">
                              {course.teacher.name} {course.teacher.surname}
                            </div>
                            <div className="text-muted small">
                              @{course.teacher.username}
                            </div>
                          </div>
                        ) : course.user ? (
                          <div>
                            <div className="fw-medium">
                              {course.user.name} {course.user.surname}
                            </div>
                            <div className="text-muted small">
                              @{course.user.username}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted fst-italic">
                            No asignado
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="admin-actions-inline">
                          <ApproveCourse
                            courseId={course.id}
                            onApprove={removeCourse}
                          />
                          <RejectCourse
                            courseId={course.id}
                            onReject={removeCourse}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Footer */}
          {filteredCourses.length > 0 && (
            <div className="d-flex justify-content-end align-items-center mt-4 pt-3 border-top">
              <small className="text-muted">
                Última actualización:{" "}
                {new Date().toLocaleString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingCourses;
