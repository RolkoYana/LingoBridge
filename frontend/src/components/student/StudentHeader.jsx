import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputGroup, Dropdown } from "react-bootstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudentHeader = ({ name }) => {
  const [user, setUser] = useState({ name: "Student" });
  const navigate = useNavigate();

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
        <Col className="text-end">
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
        </Col>
      </Row>
      <Row className="mb-3">
        <Col mb={6}>
          <InputGroup>
            <Form.Control placeholder="Buscar cursos o actividades..." />
          </InputGroup>
        </Col>
        <Col mb={6} className="text-end d-flex justify-content-end gap-4">
          <div>
            Cursos completados: <strong>2</strong>
          </div>
          <div>
            Cursos en progreso: <strong>1</strong>
          </div>
          <FaBell size={24} />
        </Col>
      </Row>
    </>
  );
};

export default StudentHeader;
