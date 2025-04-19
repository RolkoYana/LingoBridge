import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);

    // Aquí iría la llamada al backend con fetch o axios
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="username" className="mb-3">
        <InputGroup>
          <InputGroup.Text>
            <FaUser />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Nombre usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
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
