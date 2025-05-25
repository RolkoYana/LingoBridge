import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import LoginForm from "../components/forms/LoginForm";
import { FaGraduationCap } from 'react-icons/fa';

const LoginPage = () => {
  const [currentTheme, setCurrentTheme] = useState(
    document.body.getAttribute('data-theme') || 'light'
  );

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          setCurrentTheme(document.body.getAttribute('data-theme') || 'light');
        }
      }
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="login-page-wrapper min-vh-100 d-flex flex-column">

      <Container
        fluid
        className="px-0"
      >
        <Row
          className="register-header-row w-100 px-3 py-2 align-self-start"
        >
          <Col xs="auto" className="d-flex align-items-center">
            <Link to="/">
              <img
                src={logo}
                alt="LingoBridge Logo"
                height="60"
                style={{ cursor: "pointer" }}
              />
            </Link>
          </Col>
          <Col xs="auto" className="d-flex align-items-center ms-auto">
            <span className="text-secondary-themed">
              ¿Aún no tienes una cuenta?{" "}
              <Link to="/register" className="link-themed text-decoration-none fw-bold">
                Registrarse
              </Link>
            </span>
          </Col>
        </Row>
      </Container>

      {/* Formulario login */}
      <Container
        fluid
        className="login-form-area-container d-flex flex-column align-items-center justify-content-center flex-grow-1 py-4"
      >
        <div
          className="login-form-card-inner shadow rounded d-flex flex-column align-items-center"
        >
          <div className="text-center mb-4">
            <FaGraduationCap className="login-decorative-icon" />
            <h4 className="fw-bold mt-3">
              Inicia sesión en <strong>LingoBridge</strong>
            </h4>
          </div>
          <LoginForm />
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;