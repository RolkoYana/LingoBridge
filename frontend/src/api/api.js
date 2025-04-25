// definir URL del backend donde estan las rutas de autenticacion
const API_URL = "http://localhost:8080/api/auth";

// registrar un usuario
export const register = async (username, email, password, confirmPassword) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, confirmPassword }), // datos del usuario enviados en JSON
  });

  return response.json(); // respuests convertida a JSON
};

// hacer login y obtener el token JWT
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  // si el backend responde con un token, lo guarda en localStorage (permite estar autenticado incluso al recargar la pagina)
  if (data.token) {
    localStorage.setItem("token", data.token); 
  }

  return data;
};

// hacer peticiones a endpoints protegidos con el token JWT
export const fetchWithAuth = async (url, options = {}) => {
    // buscar el token en localStorage
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`,  // enviar el token en el header
    },
  });
};
