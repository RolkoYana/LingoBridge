import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { register } from "../../api/api.js";

const RegisterForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const userData = {
        name,
        surname,
        username,
        email,
        roles: [role],
        password,
        passwordConfirm,
      };

      await register(userData);
      alert("Usuario registrado correctamente");
      onSuccess();
    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "Error al registrar usuario");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3"> 
        <Col md={6}>
          <Form.Group controlId="name" className="mb-3"> 
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control-themed"
              placeholder="Tu nombre" 
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="surname" className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
              className="form-control-themed"
              placeholder="Tu apellido" 
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Nombre de usuario</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="form-control-themed"
          placeholder="Ej: tu_usuario123" 
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-control-themed"
          placeholder="ejemplo@correo.com" 
        />
      </Form.Group>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control-themed"
              placeholder="Crea una contraseña" 
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="confirmPassword" className="mb-3">
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              className="form-control-themed"
              placeholder="Confirma tu contraseña" 
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4" controlId="role">
        <Form.Label>Rol</Form.Label>
        <Form.Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="form-control-themed"
        >
          <option value="STUDENT">Alumno</option>
          <option value="TEACHER">Profesor</option>
        </Form.Select>
      </Form.Group>

      <Button type="submit" variant="primary" className="w-100 py-2">
        Registrarse
      </Button>
    </Form>
  );
};

export default RegisterForm;