import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import LoginForm from "../components/forms/LoginForm";

const LoginPage = () => {
  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-start min-vh-100 bg-light"
    >
      {/* Logo y enlace a registro */}
      <Row className="w-100 px-3 justify-content-between align-items-center mt-2">
        <Col>
          <Link to="/">
            <img src={logo} alt="Logo" height="60" />
          </Link>
        </Col>
        <Col xs="auto">
          <span>
            ¿Aún no tienes una cuenta? <Link to="/register">Registrarse</Link>
          </span>
        </Col>
      </Row>

      {/* Card con formulario */}
      <div
        className="bg-white shadow rounded p-4 mt-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="text-center mb-4">
          <h4>
            Inicia sesión en <strong>LingoBridge</strong>
          </h4>
        </div>

        <LoginForm />
      </div>
    </Container>
  );
};

export default LoginPage;
