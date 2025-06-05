import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import LoginForm from "../components/forms/LoginForm";
import { FaGraduationCap } from "react-icons/fa";
import AuthHeader from "../components/common/AuthHeader";
import "./LoginPage.css";

const LoginPage = () => {
  const [currentTheme, setCurrentTheme] = useState(
    document.body.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          setCurrentTheme(document.body.getAttribute("data-theme") || "light");
        }
      }
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="login-page-wrapper min-vh-100 d-flex flex-column">
      <AuthHeader
        prompt="¿Aún no tienes una cuenta?"
        linkText="Registrarse"
        linkTo="/register"
      />

      {/* Formulario login */}
      <Container
        fluid
        className="login-form-area-container d-flex flex-column align-items-center justify-content-center flex-grow-1 py-4"
      >
        <div className="login-form-card-inner shadow rounded d-flex flex-column align-items-center">
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
