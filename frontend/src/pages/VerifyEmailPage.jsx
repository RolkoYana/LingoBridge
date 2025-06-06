import React, { useState, useEffect } from "react";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaGraduationCap } from "react-icons/fa";
import AuthHeader from "../components/common/AuthHeader";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error, expired
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setMessage("Token de verificación no encontrado en la URL.");
      setIsVerifying(false);
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      // Usar la URL completa de la API
      const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
      const response = await fetch(`${API_URL}/auth/verify?token=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "¡Tu cuenta ha sido verificada exitosamente!");
      } else {
        // Determinar si es token expirado o error genérico
        if (data.error && data.error.includes("expirado")) {
          setStatus("expired");
        } else {
          setStatus("error");
        }
        setMessage(data.error || "Error al verificar la cuenta.");
      }
    } catch (error) {
      console.error("Error verificando email:", error);
      setStatus("error");
      setMessage("Error de conexión. Por favor, inténtalo de nuevo.");
    } finally {
      setIsVerifying(false);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const renderContent = () => {
    if (isVerifying) {
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5>Verificando tu cuenta...</h5>
          <p className="text-muted">Por favor, espera mientras procesamos tu verificación.</p>
        </div>
      );
    }

    switch (status) {
      case "success":
        return (
          <div className="text-center">
            <FaCheckCircle size={80} className="text-success mb-4" />
            <h4 className="text-success mb-3">¡Cuenta verificada!</h4>
            <p className="mb-4">{message}</p>
            <div className="d-grid">
              <Button 
                variant="success" 
                size="lg" 
                onClick={goToLogin}
                className="py-3"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        );

      case "expired":
        return (
          <div className="text-center">
            <FaExclamationTriangle size={80} className="text-warning mb-4" />
            <h4 className="text-warning mb-3">Token expirado</h4>
            <p className="mb-4">{message}</p>
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={goToRegister}
                className="py-3"
              >
                Registrarse de nuevo
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={goToLogin}
                className="py-2"
              >
                Ir al inicio de sesión
              </Button>
            </div>
          </div>
        );

      case "error":
      default:
        return (
          <div className="text-center">
            <FaTimesCircle size={80} className="text-danger mb-4" />
            <h4 className="text-danger mb-3">Error de verificación</h4>
            <p className="mb-4">{message}</p>
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={goToRegister}
                className="py-3"
              >
                Registrarse de nuevo
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={goToLogin}
                className="py-2"
              >
                Ir al inicio de sesión
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Container
      fluid
      className="verify-email-page-container d-flex flex-column align-items-center min-vh-100"
    >
      <AuthHeader
        prompt="¿Necesitas ayuda?"
        linkText="Contactar soporte"
        linkTo="/contact"
      />

      <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
        <Card className="shadow rounded p-4 p-md-5" style={{ maxWidth: "500px", width: "100%" }}>
          <Card.Body>
            <div className="text-center mb-4">
              <FaGraduationCap size={60} className="text-primary" />
              <h4 className="mt-3">
                <strong>LingoBridge</strong>
              </h4>
              <h6 className="text-muted">Verificación de email</h6>
            </div>

            {renderContent()}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default VerifyEmailPage;