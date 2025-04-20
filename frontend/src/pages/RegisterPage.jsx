import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Register = () => {
  const navigate = useNavigate();

  // Estado de los campos
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password !== confirmPassword){
        alert("Las contraseñas no coinciden");
        return;
    }

    try{
        const response = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name,
                surname,
                username,
                email,
                password,
                roles: [role], 
            }),
        });

        if(response.ok){
            alert("Usuario registrado");
            navigate("/login") // redirige a login
        }else{
            const error = await response.json();
            alert(`Error: ${error.message || "No se pudo registrar"}`);
        }
    }catch (err){
        console.log("Error:", err);
        alert("Error de conexión con el servidor")
    }
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="surname">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
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
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirmar contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4" controlId="role">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
