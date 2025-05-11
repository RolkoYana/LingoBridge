import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { FaUserCircle, FaBell } from "react-icons/fa";

const AdminHeader = () => {
  const [user, setUser] = useState({ name: "Admin" });

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

  return (
    <Row className="align-items-center mb-4">
      <Col>
        <h5>
          ¡Bienvenido, <strong>{user?.name || "Admin"}</strong>!
        </h5>
      </Col>
      <Col>
        <InputGroup>
          <Form.Control type="text" placeholder="Buscar..." />
        </InputGroup>
      </Col>
      <Col sx="auto">
        <FaBell className="me-3" size={20} />
        <FaUserCircle size={32} />
      </Col>
    </Row>
  );
};

export default AdminHeader;
