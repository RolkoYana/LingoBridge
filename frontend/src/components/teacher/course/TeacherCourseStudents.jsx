import React, { useState, useEffect } from "react";
import { Card, Button, Table, Badge, InputGroup, FormControl, Row, Col } from "react-bootstrap";
import { 
  FaUsers, 
  FaSearch, 
  FaUserGraduate, 
  FaEnvelope,
  FaSpinner,
  FaExclamationTriangle,
  FaUserFriends
} from "react-icons/fa";
import { fetchWithAuth } from "../../../api/api";
import "./TeacherCourseStudents.css";

const TeacherCourseStudents = ({ courseId }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      if (!courseId) return;

      setLoading(true);
      setError(null);
      
      try {
        const response = await fetchWithAuth(`/teacher/course/${courseId}/students`);
        setStudents(response);
        setFilteredStudents(response);
      } catch (error) {
        setError("Error al cargar los estudiantes del curso");
        console.error("Error al obtener estudiantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  // Filtrar estudiantes por término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        `${student.name} ${student.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleSendMessage = (student) => {
    // Aquí iría la lógica para enviar mensaje al estudiante
    console.log("Enviar mensaje a estudiante:", student);
    // Por ejemplo: navigate(`/teacher/course/${courseId}/student/${student.id}/message`);
    // O abrir un modal de envío de mensaje
  };

  if (loading) {
    return (
      <div className="students-loading">
        <FaSpinner className="spinner" />
        <p>Cargando estudiantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="students-error">
        <FaExclamationTriangle className="error-icon" />
        <h5>Error al cargar estudiantes</h5>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="teacher-course-students">
      <Card className="students-card">
        <Card.Header className="students-header">
          <Row className="align-items-center">
            <Col>
              <div className="header-content">
                <FaUsers className="header-icon" />
                <div>
                  <h4 className="header-title">Estudiantes del Curso</h4>
                  <p className="header-subtitle">
                    {students.length} estudiante{students.length !== 1 ? 's' : ''} inscrito{students.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </Col>
            {students.length > 0 && (
              <Col xs="auto">
                <Badge bg="primary" className="students-count">
                  <FaUserFriends className="me-1" />
                  {students.length}
                </Badge>
              </Col>
            )}
          </Row>
        </Card.Header>

        <Card.Body className="students-body">
          {students.length === 0 ? (
            <div className="no-students">
              <FaUserGraduate className="no-students-icon" />
              <h5>No hay estudiantes inscritos</h5>
              <p>Este curso aún no tiene estudiantes matriculados.</p>
            </div>
          ) : (
            <>
              {/* Buscador */}
              <div className="search-section">
                <InputGroup className="search-input">
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <FormControl
                    placeholder="Buscar estudiante por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>

              {/* Tabla de estudiantes */}
              <div className="students-table-container">
                {filteredStudents.length === 0 ? (
                  <div className="no-results">
                    <FaSearch className="no-results-icon" />
                    <p>No se encontraron estudiantes que coincidan con "{searchTerm}"</p>
                  </div>
                ) : (
                  <Table responsive className="students-table">
                    <thead>
                      <tr>
                        <th className="student-header">
                          <FaUserGraduate className="me-2" />
                          Estudiante
                        </th>
                        <th className="actions-header">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr key={student.id} className="student-row">
                          <td className="student-info">
                            <div className="student-avatar">
                              <FaUserGraduate />
                            </div>
                            <div className="student-details">
                              <div className="student-name">
                                {student.name} {student.surname}
                              </div>
                              <div className="student-username">
                                @{student.username || `user${student.id}`}
                              </div>
                            </div>
                          </td>
                          <td className="student-actions">
                            <Button
                              variant="primary"
                              size="sm"
                              className="message-btn"
                              onClick={() => handleSendMessage(student)}
                            >
                              <FaEnvelope className="me-1" />
                              Mensaje
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>

              {/* Estadísticas */}
              {filteredStudents.length > 0 && searchTerm && (
                <div className="search-stats">
                  <small className="text-muted">
                    Mostrando {filteredStudents.length} de {students.length} estudiantes
                  </small>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TeacherCourseStudents;