import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";

const StudentHeader = ({ name }) => {
  const [user, setUser] = useState({ name: "Student" });

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
    <>
      <Row className="align-items-center mb-3">
        <Col>
          <h5>
            ¡Bienvenido, <strong>{user?.name || "Student"}</strong>!
          </h5>
        </Col>
        <Col className="text-end">
          <FaUserCircle size={30} />
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
