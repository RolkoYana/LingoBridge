import React from "react";
import { Row, Col, InputGroup, Form } from "react-bootstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";

const TeacherHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));

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
      <Col sx="auto">
        <FaBell className="me-3" size={20} />
        <FaUserCircle size={32} />
      </Col>
    </Row>
  );
};

export default TeacherHeader;
