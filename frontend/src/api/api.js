const API_URL = "http://localhost:8080/api";

// Función para registrar un usuario
export const register = async (username, email, password, passwordConfirm) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, passwordConfirm }),
  });

  return response.json();
};

// Función para hacer login y recibir el token JWT
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (data.token) {
    localStorage.setItem("token", data.token); // Guardar el token en el navegador
  }

  return data;
};

// Función para hacer peticiones a endpoints protegidos con el token JWT
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`, // Enviar el token en el header
      "Content-Type": "application/json",
    },
  });
};
