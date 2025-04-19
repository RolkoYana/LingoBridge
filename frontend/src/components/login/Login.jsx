import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";
import logo from "../../assets/logo.jpg";

const Login = () => {
  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-center min-hv-100 bg-light"
    >
      {/* Logo y enlace de registro */}
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
            ¿Aún no tienes una cuenta?{" "}
            <Link to="/register" className="text-decoration-none">
              Registrarse
            </Link>
          </span>
        </Col>
      </Row>

      {/* Card de login */}
      <div
        className="bg-white shadow rounded p-4 mt-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="text-center mb-4">
          <FaUser size={64} className="text-secondary mb-2" />
          <h4>
            Inicia sesión en <strong>LingoBridge</strong>
          </h4>
        </div>

        {/* Formulario */}
        <Form>
          <Form.Group controlId="username" className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <FaUser />
              </InputGroup.Text>
              <Form.Control type="text" placeholder="Nombre usuario" />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <FaLock />
              </InputGroup.Text>
              <Form.Control type="password" placeholder="Contraseña" />
            </InputGroup>
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Check type="checkbox" label="No cerrar sesión" />
            <a href="/forgot-password">¿Has olvidado la contraseña?</a>
          </div>

          <Button variant="info" className="w-100 mb-3 text-white">
            Iniciar sesión
          </Button>

          <div className="text-center my-2">o</div>

          <Button variant="light" className="w-100 border">
            <FaGoogle className="me-2" /> Iniciar sesión con Google
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
