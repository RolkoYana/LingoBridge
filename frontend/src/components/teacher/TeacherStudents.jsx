import React, { useState, useEffect } from "react";
import { Table, Card, Row, Col, Form, InputGroup } from "react-bootstrap";
import { 
  FaUsers, 
  FaSearch, 
  FaBook
} from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";
import "./TeacherStudents.css";

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth("/teacher/students");
      setStudents(data);
    } catch (error) {
      console.log("Error al obtener estudiantes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener cursos únicos para el filtro
  const uniqueCourses = [...new Set(students.map(student => student.courseName))];

  // Filtrar estudiantes
  const filteredStudents = students
    .filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = filterCourse === "all" || student.courseName === filterCourse;
      
      return matchesSearch && matchesCourse;
    });

  const getStudentInitials = (name, surname) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  // Colores con buen contraste
  const getAvatarColor = (str) => {
    const colors = [
      '#e74c3c', // rojo
      '#3498db', // azul
      '#2ecc71', // verde
      '#f39c12', // naranja
      '#9b59b6', // morado
      '#1abc9c', // turquesa
      '#34495e', // gris oscuro
      '#c0392b'  // rojo oscuro
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <Card className="content-card p-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando estudiantes...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="content-card p-4">
      {/* Header simple */}
      <Row className="align-items-center mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <FaUsers size={24} className="text-primary me-3" />
            <div>
              <h3 className="mb-1">Mis Estudiantes</h3>
              <p className="text-muted mb-0">
                {filteredStudents.length} estudiante{filteredStudents.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Búsqueda y filtro simples */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup className="search-input-group">
            <InputGroup.Text className="search-icon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="modern-select"
          >
            <option value="all">Todos los cursos</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Lista de estudiantes */}
      {filteredStudents.length > 0 ? (
        <>
          {/* Vista de tarjetas para móvil */}
          <div className="d-md-none">
            <Row>
              {filteredStudents.map((student) => (
                <Col xs={12} key={student.username} className="mb-3">
                  <div className="student-card-simple">
                    <div className="d-flex align-items-center">
                      <div 
                        className="student-avatar"
                        style={{ backgroundColor: getAvatarColor(student.username) }}
                      >
                        {getStudentInitials(student.name, student.surname)}
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <h6 className="mb-1">{student.name} {student.surname}</h6>
                        <p className="text-muted mb-1">@{student.username}</p>
                        <div className="d-flex align-items-center">
                          <FaBook size={12} className="text-primary me-1" />
                          <small className="text-muted">{student.courseName}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Tabla para desktop */}
          <div className="d-none d-md-block">
            <Table className="modern-table" hover>
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Usuario</th>
                  <th>Curso</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.username}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="student-avatar-small me-3"
                          style={{ backgroundColor: getAvatarColor(student.username) }}
                        >
                          {getStudentInitials(student.name, student.surname)}
                        </div>
                        <div>
                          <div className="fw-semibold">{student.name} {student.surname}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="username-text">@{student.username}</span>
                    </td>
                    <td>
                      <span className="course-text">{student.courseName}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      ) : (
        <div className="empty-state text-center py-5">
          {searchTerm || filterCourse !== "all" ? (
            <>
              <FaSearch size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No se encontraron estudiantes</h5>
              <p className="text-muted">Intenta cambiar los filtros de búsqueda</p>
            </>
          ) : (
            <>
              <FaUsers size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No hay estudiantes inscritos</h5>
              <p className="text-muted">Los estudiantes aparecerán aquí cuando se inscriban en tus cursos</p>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default TeacherStudents;