import React, { useState } from "react";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import { FaUser, FaLock, FaGoogle, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/api.js";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    setShowVerificationAlert(false);

    try {
      const response = await login(username, password);

      if (response && response.token) {
        localStorage.setItem("token", response.token);

        const userData = {
          name: response.name,
          username: response.username,
          roles: response.roles,
          courses: response.courses || [],
          token: response.token,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        // Redirigir según el rol
        if (response.roles.includes("ADMIN")) {
          navigate("/admin");
        } else if (response.roles.includes("TEACHER")) {
          navigate("/teacher");
        } else if (response.roles.includes("STUDENT")) {
          navigate("/student");
        }
      } else {
        const errorMessage =
          response?.message ||
          "Credenciales inválidas. Por favor, verifica tu usuario y contraseña.";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error en login:", error);
      
      // Verificar si el error es por cuenta no verificada
      if (error.message && error.message.includes("verificada")) {
        setShowVerificationAlert(true);
        setError(error.message);
      } else {
        const errorMessage = error.message || "Credenciales incorrectas. Verifica tu usuario y contraseña.";
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // Cerrar la alerta y limpiar los inputs
  const handleCloseError = () => {
    setError("");
    setShowVerificationAlert(false);
    setUsername("");
    setPassword("");
    setShowPassword(false);
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <Form onSubmit={handleLogin} className="w-100">
      {/* Mensaje de error general */}
      {error && !showVerificationAlert && (
        <div
          className="alert alert-danger login-error-alert position-relative"
          role="alert"
        >
          <strong>⚠️ Error:</strong> {error}
          <span
            className="login-error-close-btn"
            aria-label="Close"
            onClick={handleCloseError}
          >
            ✕
          </span>
        </div>
      )}

      {/* Alerta especial para cuenta no verificada */}
      {showVerificationAlert && (
        <Alert variant="warning" className="position-relative">
          <Alert.Heading className="h6">
            <FaEnvelope className="me-2" />
            Cuenta no verificada
          </Alert.Heading>
          <p className="mb-3">{error}</p>
          <hr />
          <div className="d-flex flex-column gap-2">
            <small className="text-muted">
              • Revisa tu correo electrónico (incluyendo spam)
            </small>
            <small className="text-muted">
              • Si no encuentras el correo, puedes registrarte de nuevo para recibir un nuevo enlace
            </small>
          </div>
          <div className="mt-3">
            <Button 
              variant="outline-warning" 
              size="sm" 
              onClick={goToRegister}
              className="me-2"
            >
              Registrarse de nuevo
            </Button>
          </div>
          <span
            className="login-error-close-btn"
            aria-label="Close"
            onClick={handleCloseError}
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.75rem",
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "inherit",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              lineHeight: 1,
              transition: "opacity 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.opacity = "0.7")}
            onMouseOut={(e) => (e.target.style.opacity = "1")}
          >
            ✕
          </span>
        </Alert>
      )}

      <Form.Group className="mb-4">
        <Form.Label visuallyHidden>Nombre de usuario</Form.Label>
        <InputGroup className="input-group-lg">
          <InputGroup.Text className="input-group-text-themed px-3">
            <FaUser className="fs-5" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
            className="form-control-themed py-3 fs-6"
          />
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label visuallyHidden>Contraseña</Form.Label>
        <InputGroup className="input-group-lg">
          <InputGroup.Text className="input-group-text-themed px-3">
            <FaLock className="fs-5" />
          </InputGroup.Text>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="current-password"
            className="form-control-themed py-3 fs-6"
          />
          <InputGroup.Text
            className="input-group-text-themed password-toggle-button px-3"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <FaEyeSlash className="fs-5" />
            ) : (
              <FaEye className="fs-5" />
            )}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>

      <div className="d-flex justify-content-between align-items-center mb-4 login-options-mobile">
        <Form.Check
          type="checkbox"
          label="No cerrar sesión"
          className="text-secondary-themed fs-6"
          disabled={isLoading}
        />
        <a
          href="/forgot-password"
          className="link-themed text-decoration-none fs-6"
        >
          ¿Has olvidado la contraseña?
        </a>
      </div>

      <Button
        variant="info"
        className="w-100 mb-4 py-3 fs-5 fw-semibold text-white"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Iniciando sesión...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>

      <div className="login-separator">
        <span className="fs-6">o</span>
      </div>

      <Button
        variant="light"
        className="w-100 border btn-google-themed py-3 fs-6 fw-medium"
        disabled={isLoading}
      >
        <FaGoogle className="me-3 fs-5" />
        Iniciar sesión con Google
      </Button>
    </Form>
  );
};

export default LoginForm;