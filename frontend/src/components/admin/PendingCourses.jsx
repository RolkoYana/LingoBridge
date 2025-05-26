import React, { useEffect, useState } from "react";
import { Table, Card, Badge, Button, Form, InputGroup, Row, Col, Spinner } from "react-bootstrap";
import { FaClock, FaSearch, FaSyncAlt, FaExclamationTriangle } from "react-icons/fa";
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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.teacher && 
                          `${course.teacher.name} ${course.teacher.surname}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (course.user && 
                          `${course.user.name} ${course.user.surname}`.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <Spinner animation="border" variant="warning" />
          <p className="mt-3 text-muted">Cargando cursos pendientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pending-courses-management">
      <Card className="admin-card mb-4">
        <Card.Header className="bg-warning text-dark">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0 d-flex align-items-center">
                <FaClock className="me-2" />
                Cursos Pendientes
              </h5>
              <small className="opacity-75">Cursos esperando aprobación</small>
            </Col>
            <Col xs="auto">
              <Badge bg="dark" text="light" className="px-4 py-2 pending-stats-badge fs-6">
                <FaExclamationTriangle className="me-2" />
                Pendientes: {courses.length}
              </Badge>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {/* Control de búsqueda */}
          <Row className="mb-4">
            <Col md={8}>
              <InputGroup className="pending-search-group">
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre, descripción o profesor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control-themed"
                />
              </InputGroup>
            </Col>
            <Col md={4} className="d-flex justify-content-end">
              <Button 
                variant="warning" 
                onClick={loadCourses}
                className="btn-refresh-pending d-flex align-items-center gap-2"
              >
                <FaSyncAlt />
                Actualizar Lista
              </Button>
            </Col>
          </Row>

          {/* Tabla de cursos pendientes */}
          <div className="admin-table-container">
            <Table striped hover responsive className="mb-0 pending-courses-table">
              <thead className="table-warning">
                <tr>
                  <th width="80">
                    <div className="d-flex align-items-center justify-content-center">
                      <FaClock className="me-1" />
                      ID
                    </div>
                  </th>
                  <th>Curso</th>
                  <th>Descripción</th>
                  <th>Profesor</th>
                  <th width="200">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-5">
                      <FaClock size={48} className="mb-3 opacity-50" />
                      <p className="mb-0 fs-5 fw-semibold">
                        {searchTerm 
                          ? "No se encontraron cursos pendientes con el término de búsqueda" 
                          : "No hay cursos pendientes de aprobación"}
                      </p>
                      <small className="text-muted mt-2 d-block">
                        Los cursos aparecerán aquí cuando los profesores los envíen para aprobación
                      </small>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course.id} className="pending-course-row">
                      <td>
                        <div className="d-flex justify-content-center">
                          <div className="pending-course-id">
                            {course.id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="pending-course-info">
                          <div className="pending-course-name">{course.name}</div>
                        </div>
                      </td>
                      <td>
                        <div className="pending-course-description">
                          {course.description && course.description.length > 100 
                            ? `${course.description.substring(0, 100)}...` 
                            : course.description || <em className="text-muted">Sin descripción</em>}
                        </div>
                      </td>
                      <td>
                        <div className="pending-teacher-info">
                          {course.teacher ? (
                            <>
                              <div className="teacher-name">
                                {course.teacher.name} {course.teacher.surname}
                              </div>
                              <div className="teacher-username">
                                @{course.teacher.username}
                              </div>
                            </>
                          ) : course.user ? (
                            <>
                              <div className="teacher-name">
                                {course.user.name} {course.user.surname}
                              </div>
                              <div className="teacher-username">
                                @{course.user.username}
                              </div>
                            </>
                          ) : (
                            <span className="text-muted">
                              <em>No asignado</em>
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2 admin-table-actions">
                          <ApproveCourse courseId={course.id} onApprove={removeCourse} />
                          <RejectCourse courseId={course.id} onReject={removeCourse} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Footer simplificado */}
          {filteredCourses.length > 0 && (
            <div className="d-flex justify-content-end align-items-center mt-4 pt-3 border-top pending-footer">
              <small className="text-muted">
                Última actualización: {new Date().toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </small>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PendingCourses;