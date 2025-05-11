import React, { useState, useEffect } from "react";
import { Row, Col, InputGroup, Form, Dropdown } from "react-bootstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TeacherHeader = () => {
  const [user, setUser] = useState({ name: "Profesor" });
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
    <Row className="align-items-center mb-4">
      <Col>
        <h5>
          ¡Bienvenido, <strong>{user?.name || "Profesor"}</strong>!
        </h5>
      </Col>
      <Col>
        <InputGroup>
          <Form.Control type="text" placeholder="Buscar..." />
        </InputGroup>
      </Col>
      <Col xs="auto">
        <div className="d-flex align-items-center gap-3">
          <FaBell size={20} />
          <Dropdown align="end">
            <Dropdown.Toggle
              as="span"
              style={{ cursor: "pointer" }}
              id="dropdown-user"
            >
              <FaUserCircle size={32} />
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
  );
};

export default TeacherHeader;
