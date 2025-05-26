import React, { useEffect, useState } from "react";
import { Table, Card, Badge, Button, Form, InputGroup, Row, Col, Spinner } from "react-bootstrap";
import { FaGraduationCap, FaSearch, FaCheckCircle, FaSyncAlt } from "react-icons/fa";
import CompleteCourse from "./CompleteCourse";
import { fetchWithAuth } from "../../api/api";

const ActiveCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadCourses = () => {
    setLoading(true);
    fetchWithAuth("/admin/active-courses")
      .then((data) => {
        const activeCourses = data.filter((course) => course.approved && !course.completed);
        setCourses(activeCourses);
      })
      .catch((err) => console.error("Error al cargar cursos:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const removeCourse = (courseId) => {
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.teacher && 
                          `${course.teacher.name} ${course.teacher.surname}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="mt-3 text-muted">Cargando cursos activos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="active-courses-management">
      <Card className="admin-card mb-4">
        <Card.Header className="text-white active-courses-header">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0 d-flex align-items-center">
                <FaCheckCircle className="me-2" />
                Cursos Activos
              </h5>
              <small className="opacity-75">Cursos aprobados y en progreso</small>
            </Col>
            <Col xs="auto">
              <Badge bg="light" text="dark" className="px-4 py-2 active-stats-badge fs-6">
                <FaGraduationCap className="me-2" />
                Total: {courses.length}
              </Badge>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {/* Control de búsqueda */}
          <Row className="mb-4">
            <Col md={8}>
              <InputGroup className="active-search-group">
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
                variant="success" 
                onClick={loadCourses}
                className="btn-refresh-courses d-flex align-items-center gap-2"
              >
                <FaSyncAlt />
                Actualizar Cursos
              </Button>
            </Col>
          </Row>

          {/* Tabla de cursos activos */}
          <div className="admin-table-container">
            <Table striped hover responsive className="mb-0 active-courses-table">
              <thead className="table-success">
                <tr>
                  <th width="80">
                    <div className="d-flex align-items-center justify-content-center">
                      <FaGraduationCap className="me-1" />
                      ID
                    </div>
                  </th>
                  <th>Curso</th>
                  <th>Profesor</th>
                  <th width="150">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-5">
                      <FaCheckCircle size={48} className="mb-3 opacity-50" />
                      <p className="mb-0 fs-5 fw-semibold">
                        {searchTerm 
                          ? "No se encontraron cursos activos con el término de búsqueda" 
                          : "No hay cursos activos en este momento"}
                      </p>
                      <small className="text-muted mt-2 d-block">
                        Los cursos activos son aquellos que han sido aprobados y están en progreso
                      </small>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course.id} className="active-course-row">
                      <td>
                        <div className="d-flex justify-content-center">
                          <div className="active-course-id">
                            {course.id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="active-course-info">
                          <div className="active-course-name">{course.name}</div>
                          {course.description && (
                            <div className="active-course-description">
                              {course.description.length > 80 
                                ? `${course.description.substring(0, 80)}...` 
                                : course.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="active-teacher-info">
                          {course.teacher ? (
                            <>
                              <div className="teacher-name">
                                {course.teacher.name} {course.teacher.surname}
                              </div>
                              <div className="teacher-username">
                                @{course.teacher.username}
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
                        <div className="d-flex justify-content-center">
                          <CompleteCourse
                            courseId={course.id}
                            onComplete={removeCourse}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Footer simplificado - solo última actualización */}
          {filteredCourses.length > 0 && (
            <div className="d-flex justify-content-end align-items-center mt-4 pt-3 border-top active-footer">
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

export default ActiveCourses;