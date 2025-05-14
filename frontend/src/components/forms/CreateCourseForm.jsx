import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Modal } from "react-bootstrap";
import { fetchWithAuth } from "../../api/api";

const CreateCourseForm = ({ onSuccess }) => {
  const [course, setCourse] = useState({
    name: "",
    description: "",
    level: "A1",
    type: "INTENSIVO",
    completedAt: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const courseTypes = ["INTENSIVO", "GRUPAL", "FLEXIBLE"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
      alert("No se encontró el usuario autenticado.");
      return;
    }

    const courseToSend = {
      ...course,
      approved: false,
      completed: false,
    };

    try {
      const data = await fetchWithAuth(
        `/teacher/create-course?teacherUsername=${user.username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseToSend),
        }
      );

      alert("Curso creado correctamente");
      onSuccess();
      setCourse({
        name: "",
        description: "",
        level: "A1",
        type: "INTENSIVO",
        completedAt: "",
      });
    } catch (error) {
      console.error("Error al crear el curso:", error);
      alert("Hubo un error al crear el curso");
    }
  };

  return (
    <Card className="p-4">
      <h3>Crear Curso</h3>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del curso</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce el nombre del curso"
                name="name"
                value={course.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe el curso"
                name="description"
                value={course.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nivel</Form.Label>
              <Form.Select
                name="level"
                value={course.level}
                onChange={handleChange}
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de curso</Form.Label>
              <Form.Select
                name="type"
                value={course.type}
                onChange={handleChange}
              >
                {courseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de finalización (opcional)</Form.Label>
              <Form.Control
                type="date"
                name="completedAt"
                value={course.completedAt}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Guardar Curso
        </Button>
      </Form>
    </Card>
  );
};

export default CreateCourseForm;
