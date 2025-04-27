import React from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { FaUserCircle, FaBell } from "react-icons/fa";

const AdminHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));

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
