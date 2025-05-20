import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputGroup, Dropdown } from "react-bootstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../api/api";

const StudentHeader = ({ name }) => {
  const [user, setUser] = useState({ name: "Student" });
  const navigate = useNavigate();
  const [completedCourses, setCompletedCourses] = useState(0);
  const [inProgressCourses, setInProgressCourses] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error al parsear user:", e);
      }
    }
  }, []);

  // Función para obtener los cursos del estudiante
  const loadStudentCourses = async () => {
    try {
      const courses = await fetchWithAuth("/student/courses");

      // Imprime los cursos recibidos
      console.log("Cursos del estudiante:", courses);

      // Contar los cursos completados y en progreso
      const completed = courses.filter(course => course.completed === true).length;
      const inProgress = courses.filter(course => course.completed === false).length;

      // Imprime las cantidades de cursos completados y en progreso
      console.log("Cursos completados:", completed);
      console.log("Cursos en progreso:", inProgress);

      setCompletedCourses(completed);
      setInProgressCourses(inProgress);
    } catch (err) {
      console.error("Error al obtener los cursos del estudiante:", err);
    }
  };

  useEffect(() => {
    loadStudentCourses();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Row className="align-items-center mb-3">
        <Col>
          <h5>
            ¡Bienvenido, <strong>{user?.name || "Student"}</strong>!
          </h5>
        </Col>

        <Col>
          <InputGroup>
            <Form.Control placeholder="Buscar cursos o actividades..." />
          </InputGroup>
        </Col>

        <Col xs="auto">
          <div className="d-flex align-items-center gap-3">
            <FaBell size={20} style={{ cursor: "pointer" }} />
            <Dropdown align="end">
              <Dropdown.Toggle
                as="span"
                style={{ cursor: "pointer" }}
                id="dropdown-user"
              >
                <FaUserCircle size={30} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>

      {/* Estadísticas de cursos */}
      <Row className="mb-3">
        <Col className="d-flex justify-content-end gap-4">
          <div>
            Cursos completados: <strong>{completedCourses}</strong>
          </div>
          <div>
            Cursos en progreso: <strong>{inProgressCourses}</strong>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default StudentHeader;
