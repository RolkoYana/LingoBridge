import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });

  const handleChange = (e) => {
    setFormData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Aquí luego conectaremos con el backend usando fetch o axios
    console.log("Formulario enviado:", formData);
  };

  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light"
    >
      {/* Logo y enlace a login */}
      <Row className="w-100 px-3 justify-content-between align-items-center mt-2">
        <Col xs="auto">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              height="60"
              style={{ cursor: "pointer" }}
            />
          </Link>
        </Col>
        <Col xs="auto">
          <span>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-decoration-none">
              Inicia sesión
            </Link>
          </span>
        </Col>
      </Row>

      {/* Card de registro */}
      <div
        className="bg-white shadow rounded p-4 mt-4"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h4 className="text-center mb-4">
          Regístrate en <strong>LingoBridge</strong>
        </h4>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="surname">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirmar contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4" controlId="role">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="STUDENT">Alumno</option>
              <option value="TEACHER">Profesor</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Registrarse
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Register;
