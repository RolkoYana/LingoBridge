import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application:json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();
      // guarda el token si se usa
      localStorage.setItem("token", data.token);
      // redirige al panel
      navigate("/admin");
    } catch (err) {
      console.error("Error en login:", err);
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "100px" }}>
      <h2>Login Admin</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo eléctronico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">Iniciar sesión</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginAdmin;
