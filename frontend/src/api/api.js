const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";


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
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("user", JSON.stringify({ name: data.name }));
  }

  return data;
};

export const fetchWithAuth = async (url, options = {}, expectBlob = false) => {
  const token = localStorage.getItem("token");
  console.log("Token usado en fetch:", token); // depuracion

  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  // agrega "Content-Type: application/json" si no se usa FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  console.log("Headers enviados:", headers); // depuracion

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText}`);
  }

  // soporte para blobs (para descarga de archivos)
  if (expectBlob) {
    return response.blob();
  }

  // convertir la respuesta a JSON si es posible
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response; // devuleve objeto Response si no es JSON
};
