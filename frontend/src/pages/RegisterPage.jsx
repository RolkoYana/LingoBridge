import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import RegisterForm from "../components/forms/RegisterForm";
import { FaGraduationCap } from "react-icons/fa";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/login");
  };

  return (
    <Container
      fluid
      className="register-page-container d-flex flex-column align-items-center min-vh-100" 
    >
      <Row
        className="register-header-row w-100 px-3 py-2 align-self-start" 
      >
        <Col xs="auto" className="d-flex align-items-center">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              height="60"
              style={{ cursor: "pointer" }}
            />
          </Link>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <span className="text-secondary-themed">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="link-themed text-decoration-none fw-bold"> 
              Inicia sesión
            </Link>
          </span>
        </Col>
      </Row>

      <Card className="register-card shadow rounded p-4 p-md-5 mt-4">
        <Card.Body>
          <div className="text-center mb-3">
            <FaGraduationCap size={90} className="text-primary" />
          </div>
          <h4 className="text-center mb-4 primary-text">
            Regístrate en <strong>LingoBridge</strong>
          </h4>

          <RegisterForm onSuccess={handleSuccess} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;