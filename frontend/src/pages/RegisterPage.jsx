import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import RegisterForm from "../components/forms/RegisterForm";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/login");
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

        <RegisterForm onSuccess={handleSuccess} />
      </div>
    </Container>
  );
};

export default RegisterPage;
