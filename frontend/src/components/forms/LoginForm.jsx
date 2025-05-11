import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/api.js";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login(username, password);

      console.log("Respuesta del login:", response); // depuracion
      console.log("Roles recibidos:", response.roles); // verificar roles

      if (response.token) {
        alert("Login exitoso");

        // guardar el token y usuario en localStorage
        localStorage.setItem("token", response.token);

        // obtener datos del usuario
        const userData = {
          name: response.name,
          username: response.username,
          roles: response.roles,
          courses: response.courses || [], // confirmar que courses existe
          token: response.token,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        // redirigir segun el rol
        if (response.roles.includes("ADMIN")) {
          console.log("Redirigiendo a /admin...");
          navigate("/admin");
        } else if (response.roles.includes("STUDENT")) {
          console.log("Redirigiendo a /student...");
          navigate("/student");
        } else {
          console.log("Redirigiendo a /teacher...");
          navigate("/teacher");
        }
      } else {
        alert(response.message || "Credenciales invalidas");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <Form onSubmit={handleLogin}>
      <Form.Group controlId="username" className="mb-3">
        <InputGroup>
          <InputGroup.Text>
            <FaUser />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Nombre usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="password" className="mb-3">
        <InputGroup>
          <InputGroup.Text>
            <FaLock />
          </InputGroup.Text>
          <Form.Control
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </InputGroup>
      </Form.Group>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Check type="checkbox" label="No cerrar sesión" />
        <a href="/forgot-password">¿Has olvidado la contraseña?</a>
      </div>

      <Button variant="info" className="w-100 mb-3 text-white" type="submit">
        Iniciar sesión
      </Button>

      <div className="text-center my-2">o</div>

      <Button variant="light" className="w-100 border">
        <FaGoogle className="me-2" /> Iniciar sesión con Google
      </Button>
    </Form>
  );
};

export default LoginForm;
