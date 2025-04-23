import React from "react";
import { Col, Row, Card } from "react-bootstrap";

const AdminStats = () => {
  return (
    <div id="stats">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>Alumnos registrados</h6>
              <p>32</p> {/* ????? */}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>Profesores activos</h6>
              <p>6</p> {/* ??? */}
            </Card.Body>
          </Card>
        </Col>
        <Col mb={4}>
          <Card>
            <Card.Body>
              <h6>Total de cursos</h6>
              <p>12</p> {/* ??? */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminStats;
