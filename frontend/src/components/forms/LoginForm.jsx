import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaUser, FaLock, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/api.js";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login(username, password);

      if (response.token) {
        alert("Login exitoso");

        localStorage.setItem("token", response.token);

        const userData = {
          name: response.name,
          username: response.username,
          roles: response.roles,
          courses: response.courses || [], 
          token: response.token,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        // redirigir segun el rol
        if (response.roles.includes("ADMIN")) {
          console.log("Redirigiendo a /admin...");
          navigate("/admin");
        } else if (response.roles.includes("TEACHER")) {
          console.log("Redirigiendo a /teacher...");
          navigate("/teacher");
        } else if (response.roles.includes("STUDENT")) {
          console.log("Redirigiendo a /student...");
          navigate("/student");
        }
      } else {
        alert(response.message || "Credenciales invalidas");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  // gestionar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Form onSubmit={handleLogin}>
      <Form.Group className="mb-3">
        <Form.Label visuallyHidden>Nombre de usuario o Email</Form.Label>
        <InputGroup>
          <InputGroup.Text className="input-group-text-themed">
            <FaUser />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Nombre de usuario o Email" // Asegúrate de esto
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-control-themed"
          />
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label visuallyHidden>Contraseña</Form.Label>
        <InputGroup>
          <InputGroup.Text className="input-group-text-themed">
            <FaLock />
          </InputGroup.Text>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña" // Asegúrate de esto
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="form-control-themed"
          />
          {/* nuevo input con el botón de ojo */}
          <InputGroup.Text
            className="input-group-text-themed password-toggle-button" 
            onClick={togglePasswordVisibility}
            style={{ cursor: 'pointer' }} 
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Check type="checkbox" label="No cerrar sesión" className="text-secondary-themed" />
        <a href="/forgot-password" className="link-themed text-decoration-none">¿Has olvidado la contraseña?</a>
      </div>

      <Button variant="info" className="w-100 mb-3 text-white" type="submit">
        Iniciar sesión
      </Button>

      <div className="text-center my-2 text-muted-themed">o</div>

      <Button variant="light" className="w-100 border btn-google-themed">
        <FaGoogle className="me-2" /> Iniciar sesión con Google
      </Button>
    </Form>
  );
};

export default LoginForm;