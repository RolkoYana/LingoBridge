const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// manejar solicitudes con fetch
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error en la solicitud");
  }
  return response.json();
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al registrar usuario');
    }

    return data; // Devolver la respuesta completa que incluye el message
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// hacer login y recibir el token JWT
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    // Si la respuesta no es ok (status 400, 401, 500, etc.)
    if (!response.ok) {
      let errorMessage = "Credenciales incorrectas";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        // Si no puede parsear JSON, usar mensaje por defecto
      }

      // Lanzar error con mensaje específico
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("user", JSON.stringify({ name: data.name }));
    }

    return data;
  } catch (error) {
    // Re-lanzar el error para que sea capturado en el componente
    throw error;
  }
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
