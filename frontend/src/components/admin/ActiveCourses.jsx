import React, { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup, Row, Col, Spinner, Badge } from "react-bootstrap";
import { FaCheckCircle, FaSearch, FaSyncAlt, FaGraduationCap } from "react-icons/fa";
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
    <div className="unified-section">
      {/* Header de la sección */}
      <div className="section-header">
        <Row className="align-items-center">
          <Col>
            <h2 className="section-title">
              <FaCheckCircle className="header-icon me-3" />
              Cursos Activos
            </h2>
            <p className="section-subtitle">
              Cursos aprobados y en progreso
            </p>
          </Col>
          <Col xs="auto">
            <Badge bg="success" className="px-4 py-2 fs-6">
              <FaGraduationCap className="me-2" />
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
                className="btn-admin-success d-flex align-items-center gap-2"
                onClick={loadCourses}
              >
                <FaSyncAlt />
                Actualizar Cursos
              </Button>
            </Col>
          </Row>

          {/* Tabla de cursos activos */}
          <div className="table-responsive">
            <Table className="admin-table mb-0">
              <thead>
                <tr>
                  <th width="80">
                    <FaGraduationCap className="me-1" />
                    ID
                  </th>
                  <th>Curso</th>
                  <th>Profesor</th>
                  <th width="180">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div className="empty-section">
                        <FaCheckCircle size={48} className="empty-icon" />
                        <h5 className="empty-title">
                          {searchTerm 
                            ? "No se encontraron cursos activos" 
                            : "No hay cursos activos"}
                        </h5>
                        <p className="empty-text">
                          {searchTerm 
                            ? "No se encontraron cursos activos con el término de búsqueda" 
                            : "Los cursos activos son aquellos que han sido aprobados y están en progreso"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course.id}>
                      <td>
                        <div className="d-flex justify-content-center">
                          <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center"
                               style={{ width: "35px", height: "35px", fontSize: "0.85rem", fontWeight: "600" }}>
                            {course.id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold text-success">{course.name}</div>
                          {course.description && (
                            <div className="text-muted small">
                              {course.description.length > 80 
                                ? `${course.description.substring(0, 80)}...` 
                                : course.description}
                            </div>
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
                        ) : (
                          <span className="text-muted fst-italic">No asignado</span>
                        )}
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

          {/* Footer */}
          {filteredCourses.length > 0 && (
            <div className="d-flex justify-content-end align-items-center mt-4 pt-3 border-top">
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
        </div>
      </div>
    </div>
  );
};

export default ActiveCourses;