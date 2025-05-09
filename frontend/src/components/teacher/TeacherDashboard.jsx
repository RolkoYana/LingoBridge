import React from "react";
import { Row, Col, Button, Card, Table } from "react-bootstrap";

const TeacherDashboard = ({ name }) => {
  return (
    <>
      <Card className="p-3 mb-3">
        <h4>¡Bienvenido, {name}!</h4>
      </Card>

      <Row>
        <Col md={8}>
          <Card className="p-3 mb-3">
            <h5>Mis Alumnos</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Curso</th>
                  <th>Progreso</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Alumno 1</td>
                  <td>Curso A</td>
                  <td>80%</td>
                </tr>
                <tr>
                  <td>Alumno 2</td>
                  <td>Curso B</td>
                  <td>60%</td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 mb-3">
            <h5>Crear un curso</h5>
            <Button variant="primary">Crear Curso</Button>
          </Card>

          <Card className="p-3">
            <h5>Próximas Clases</h5>
            <p>Grupo A - 12/05/2025, 10:00 AM</p>
            <p>Grupo B - 14/05/2025, 14:00 PM</p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TeacherDashboard;
