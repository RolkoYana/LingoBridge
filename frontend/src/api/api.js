const API_URL = "http://localhost:8080/api";

// manejar solicitudes con fetch
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error en la solicitud");
  }
  return response.json();
};

// registrar un usuario
export const register = async (username, email, password, passwordConfirm) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, passwordConfirm }),
  });

  return handleResponse(response);
};

// hacer login y recibir el token JWT
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(response);

  if (data.token) {
    localStorage.setItem("token", data.token); // guardar el token
    localStorage.setItem("user", JSON.stringify({ name: data.name }));
  }

  return data;
};

// hacer peticiones a endpoints protegidos con el token JWT
// export const fetchWithAuth = async (url, options = {}) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     throw new Error("Usuario no autenticado");
//   }

//   return fetch(`${API_URL}${url}`, {
//     ...options,
//     headers: {
//       ...options.headers,
//       Authorization: `Bearer ${token}`, // enviar el token en el header
//       "Content-Type": "application/json",
//     },
//   });
// };

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`, // enviar el token en el header
      "Content-Type": "application/json",
    },
  });

  // Verifica que la respuesta sea exitosa
  if (!response.ok) {
    throw new Error(`Error en la respuesta: ${response.status}`);
  }

  // Convierte la respuesta a JSON antes de devolverla
  return response.json();
};
