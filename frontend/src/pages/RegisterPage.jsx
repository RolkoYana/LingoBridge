import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/forms/RegisterForm";
import { FaGraduationCap } from "react-icons/fa";
import AuthHeader from "../components/common/AuthHeader";
import "./RegisterPage.css";

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
      <AuthHeader
        prompt="¿Ya tienes cuenta?"
        linkText="Inicia sesión"
        linkTo="/login"
      />

      <Card className="register-card shadow rounded p-4 p-md-5 mt-4">
        <Card.Body>
          <div className="text-center mb-3">
            <FaGraduationCap size={90} className="register-graduation-icon" />
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
