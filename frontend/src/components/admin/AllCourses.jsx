import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Form, InputGroup, Row, Col, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaBook, FaSearch, FaFilter, FaGraduationCap, FaLaptop, FaUsers, FaSyncAlt } from "react-icons/fa";
import { fetchWithAuth } from '../../api/api';
import "./AllCourses.css";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth("/admin/all-courses");
      setCourses(data);
    } catch (error) {
      console.error("Error al cargar todos los cursos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const getEstadoCurso = (course) => {
    if (!course.approved) return "Pendiente";
    if (course.completed) return "Finalizado";
    return "Activo";
  };

  const getBadgeVariant = (course) => {
    if (!course.approved) return "warning";
    if (course.completed) return "success";
    return "primary";
  };

  const getBadgeClass = (course) => {
    const estado = getEstadoCurso(course);
    return `status-badge badge-${estado.toLowerCase()}`;
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'presencial':
        return <FaUsers className="me-1" />;
      case 'virtual':
        return <FaLaptop className="me-1" />;
      default:
        return <FaGraduationCap className="me-1" />;
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterStatus === "todos") return matchesSearch;
    
    const courseStatus = getEstadoCurso(course);
    return matchesSearch && courseStatus.toLowerCase() === filterStatus.toLowerCase();
  });

  const stats = {
    total: courses.length,
    activos: courses.filter(c => c.approved && !c.completed).length,
    pendientes: courses.filter(c => !c.approved).length,
    finalizados: courses.filter(c => c.completed).length
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando cursos...</p>
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
              <FaBook className="header-icon me-3" />
              Todos los Cursos
            </h2>
            <p className="section-subtitle">
              Gestión completa de todos los cursos del sistema
            </p>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2 flex-wrap">
              <Badge bg="light" text="dark" className="px-3 py-2">
                <strong>Total: {stats.total}</strong>
              </Badge>
              <Badge bg="success" className="px-3 py-2">
                <strong>Activos: {stats.activos}</strong>
              </Badge>
              <Badge bg="warning" className="px-3 py-2">
                <strong>Pendientes: {stats.pendientes}</strong>
              </Badge>
              <Badge bg="secondary" className="px-3 py-2">
                <strong>Finalizados: {stats.finalizados}</strong>
              </Badge>
            </div>
          </Col>
        </Row>
      </div>

      {/* Contenido de la sección */}
      <div className="section-content">
        <div className="p-4">
          {/* Controles de búsqueda y filtros */}
          <Row className="mb-4">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <div className="d-flex gap-2">
                <InputGroup className="flex-grow-1">
                  <InputGroup.Text>
                    <FaFilter />
                  </InputGroup.Text>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="activo">Activos</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="finalizado">Finalizados</option>
                  </Form.Select>
                </InputGroup>
                <Button 
                  className="btn-admin-primary"
                  onClick={loadCourses}
                  title="Actualizar lista"
                >
                  <FaSyncAlt />
                </Button>
              </div>
            </Col>
          </Row>

          {/* Tabla de cursos */}
          <div className="table-responsive">
            <Table className="admin-table mb-0">
              <thead>
                <tr>
                  <th width="80">#</th>
                  <th>Curso</th>
                  <th>Descripción</th>
                  <th width="120">Modalidad</th>
                  <th width="120">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <div className="empty-section">
                        <FaBook size={48} className="empty-icon" />
                        <h5 className="empty-title">
                          {searchTerm || filterStatus !== "todos" 
                            ? "No se encontraron cursos" 
                            : "No hay cursos registrados"}
                        </h5>
                        <p className="empty-text">
                          {searchTerm || filterStatus !== "todos" 
                            ? "No se encontraron cursos con los filtros aplicados" 
                            : "Los cursos aparecerán aquí cuando se registren en el sistema"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course, index) => (
                    <tr key={course.id}>
                      <td>
                        <div className="d-flex justify-content-center">
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                               style={{ width: "35px", height: "35px", fontSize: "0.85rem", fontWeight: "600" }}>
                            {course.id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold text-primary course-name">{course.name}</div>
                      </td>
                      <td>
                        <div className="course-description">
                          {course.description ? (
                            course.description.length > 100 ? (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-desc-${course.id}`}>
                                    {course.description}
                                  </Tooltip>
                                }
                              >
                                <span className="description-truncated">
                                  {course.description.substring(0, 100)}...
                                </span>
                              </OverlayTrigger>
                            ) : (
                              <span>{course.description}</span>
                            )
                          ) : (
                            <em className="text-muted">Sin descripción</em>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center course-type">
                          {getTypeIcon(course.type)}
                          <span>{course.type || "No especificado"}</span>
                        </div>
                      </td>
                      <td>
                        <div className={getBadgeClass(course)}>
                          {getEstadoCurso(course)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Footer con información */}
          {filteredCourses.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <small className="text-muted">
                Mostrando {filteredCourses.length} de {courses.length} cursos
              </small>
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

export default AllCourses;