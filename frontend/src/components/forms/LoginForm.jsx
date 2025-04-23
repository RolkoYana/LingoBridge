import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // guardamos los datos en el localStorage
        localStorage.setItem("user", JSON.stringify({
          token: data.token,
          username: data.username,
          roles: data.roles,
          name: data.name,
          surname: data.surname
        }));
        

        // redirigir segun rol
        if (data.roles.includes("ADMIN")) {
          navigate("/admin");
        } else if (data.roles.includes("STUDENT")) {
          navigate("/student");
        } else {
          navigate("/teacher");
        }
      } else {
        const error = await response.json();
        alert(error.message || "Credenciales inválidas");
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
