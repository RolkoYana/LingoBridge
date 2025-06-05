import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { register } from "../../api/api.js";

const RegisterForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validar el formulario
  const validateForm = () => {
    // Verificar campos vacíos
    if (!name.trim()) {
      return "El nombre es obligatorio";
    }
    if (!surname.trim()) {
      return "El apellido es obligatorio";
    }
    if (!username.trim()) {
      return "El nombre de usuario es obligatorio";
    }
    if (!email.trim()) {
      return "El correo electrónico es obligatorio";
    }
    if (!password) {
      return "La contraseña es obligatoria";
    }
    if (!passwordConfirm) {
      return "Debes confirmar la contraseña";
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "El formato del correo electrónico no es válido";
    }

    // Validar longitud mínima de campos
    if (name.trim().length < 2) {
      return "El nombre debe tener al menos 2 caracteres";
    }
    if (surname.trim().length < 2) {
      return "El apellido debe tener al menos 2 caracteres";
    }
    if (username.trim().length < 3) {
      return "El nombre de usuario debe tener al menos 3 caracteres";
    }

    // Validar contraseña
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }

    // Verificar que las contraseñas coincidan
    if (password !== passwordConfirm) {
      return "Las contraseñas no coinciden";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        name: name.trim(),
        surname: surname.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        roles: [role],
        password,
        passwordConfirm,
      };

      await register(userData);
      setSuccess("Usuario registrado correctamente.");

      // Limpiar formulario después del éxito
      clearForm();

      // Redirigir después de 2 segundos
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage =
        err.message || "Error al registrar usuario. Inténtalo de nuevo.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para limpiar el formulario
  const clearForm = () => {
    setName("");
    setSurname("");
    setUsername("");
    setEmail("");
    setRole("STUDENT");
    setPassword("");
    setPasswordConfirm("");
  };

  // Cerrar la alerta de error y limpiar inputs
  const handleCloseError = () => {
    setError("");
    clearForm();
  };

  // Cerrar la alerta de éxito
  const handleCloseSuccess = () => {
    setSuccess("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* MENSAJE DE ERROR */}
      {error && (
        <div
          className="alert alert-danger register-error-alert position-relative mb-4"
          role="alert"
        >
          <strong>⚠️ Error:</strong> {error}
          <span
            className="register-error-close-btn"
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
        </div>
      )}

      {/* MENSAJE DE ÉXITO */}
      {success && (
        <div
          className="alert alert-success register-success-alert position-relative mb-4"
          role="alert"
        >
          <strong>✅ Éxito:</strong> {success}
          <span
            className="register-success-close-btn"
            aria-label="Close"
            onClick={handleCloseSuccess}
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
        </div>
      )}

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className="form-control-themed"
              placeholder="Tu nombre"
              maxLength={50}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="surname" className="mb-3">
            <Form.Label>Apellido *</Form.Label>
            <Form.Control
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
              disabled={isLoading}
              className="form-control-themed"
              placeholder="Tu apellido"
              maxLength={50}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Nombre de usuario *</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
          className="form-control-themed"
          placeholder="Ej: tu_usuario123"
          maxLength={30}
        />
        <Form.Text className="text-secondary-themed">
          Mínimo 3 caracteres
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Correo electrónico *</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="form-control-themed"
          placeholder="ejemplo@correo.com"
        />
      </Form.Group>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Contraseña *</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="form-control-themed"
              placeholder="Crea una contraseña"
              autoComplete="new-password"
            />
            <Form.Text className="text-secondary-themed">
              Mínimo 6 caracteres
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="confirmPassword" className="mb-3">
            <Form.Label>Confirmar contraseña *</Form.Label>
            <Form.Control
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              disabled={isLoading}
              className="form-control-themed"
              placeholder="Confirma tu contraseña"
              autoComplete="new-password"
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4" controlId="role">
        <Form.Label>Rol</Form.Label>
        <Form.Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isLoading}
          className="form-control-themed"
        >
          <option value="STUDENT">Alumno</option>
          <option value="TEACHER">Profesor</option>
        </Form.Select>
      </Form.Group>

      <Button
        type="submit"
        variant="primary"
        className="w-100 py-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Registrando...
          </>
        ) : (
          "Registrarse"
        )}
      </Button>

      <div className="text-center mt-3">
        <small className="text-secondary-themed">
          Los campos marcados con * son obligatorios
        </small>
      </div>
    </Form>
  );
};

export default RegisterForm;
