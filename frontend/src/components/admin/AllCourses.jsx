import React, { useEffect, useState } from 'react';
import { Table, Card, Badge, Button, Form, InputGroup, Row, Col, Spinner } from "react-bootstrap";
import { FaBook, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaGraduationCap, FaLaptop, FaUsers } from "react-icons/fa";
import { fetchWithAuth } from '../../api/api';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  useEffect(() => {
    const fetchCourses = async () => {
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

    fetchCourses();
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
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    <div className="courses-management">
      <Card className="admin-card mb-4">
        <Card.Header className="bg-primary text-white">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0 d-flex align-items-center">
                <FaBook className="me-2" />
                Gestión de Todos los Cursos
              </h5>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-3">
                <Badge bg="light" text="dark" className="px-3 py-2">
                  Total: {stats.total}
                </Badge>
                <Badge bg="success" className="px-3 py-2">
                  Activos: {stats.activos}
                </Badge>
                <Badge bg="warning" className="px-3 py-2">
                  Pendientes: {stats.pendientes}
                </Badge>
                <Badge bg="secondary" className="px-3 py-2">
                  Finalizados: {stats.finalizados}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
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
                  className="form-control-themed"
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-control-themed"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="activo">Activos</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="finalizado">Finalizados</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>

          {/* Tabla de cursos */}
          <div className="admin-table-container">
            <Table striped hover responsive className="mb-0">
              <thead className="table-primary">
                <tr>
                  <th width="80">
                    <div className="d-flex align-items-center justify-content-center">
                      #
                    </div>
                  </th>
                  <th>Curso</th>
                  <th>Descripción</th>
                  <th width="120">Modalidad</th>
                  <th width="120">Estado</th>
                  <th width="150">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-5">
                      <FaBook size={48} className="mb-3 opacity-50" />
                      <p className="mb-0">
                        {searchTerm || filterStatus !== "todos" 
                          ? "No se encontraron cursos con los filtros aplicados" 
                          : "No hay cursos registrados"}
                      </p>
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
                        <div>
                          <div className="fw-bold text-primary">{course.name}</div>
                        </div>
                      </td>
                      <td>
                        <div className="course-description">
                          {course.description?.length > 100 
                            ? `${course.description.substring(0, 100)}...` 
                            : course.description || "Sin descripción"}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {getTypeIcon(course.type)}
                          <span className="course-type-text">{course.type || "No especificado"}</span>
                        </div>
                      </td>
                      <td>
                        <Badge 
                          bg={getBadgeVariant(course)} 
                          className="px-2 py-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {getEstadoCurso(course)}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            title="Ver detalles"
                            className="btn-action"
                          >
                            <FaEye />
                          </Button>
                          <Button 
                            variant="outline-warning" 
                            size="sm" 
                            title="Editar"
                            className="btn-action"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            title="Eliminar"
                            className="btn-action"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {filteredCourses.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
              <small className="text-muted">
                Mostrando {filteredCourses.length} de {courses.length} cursos
              </small>
              <small className="text-muted">
                Última actualización: {new Date().toLocaleString()}
              </small>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AllCourses;