import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const StudentSidebar = ({ setActiveSection }) => {
  const [courses, setCourses] = useState([]);
  const [showTeacherButton, setShowTeacherButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.roles.includes("STUDENT") && user.courses) {
      setCourses(user.courses);
    }

    // Mostrar botón solo si tiene ambos roles
    if (user && user.roles.includes("STUDENT") && user.roles.includes("TEACHER")) {
      setShowTeacherButton(true);
    } else {
      setShowTeacherButton(false);
    }
  }, []);

  return (
    <Nav className="flex-column text-center mt-4">
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => {
          setActiveSection("mis-cursos");
          navigate("/student");
        }}
      >
        Inicio
      </Nav.Link>
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("cursos-disponibles")}
      >
        Cursos Disponibles
      </Nav.Link>
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("mis-cursos")}
      >
        Mis cursos
      </Nav.Link>
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("evaluaciones")}
      >
        Mis Evaluaciones
      </Nav.Link>
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("chat")}
      >
        Mensajes
      </Nav.Link>

      {/* Botón para volver a modo profesor */}
      {showTeacherButton && (
        <Nav.Link
          className="text-white mt-3"
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => navigate("/teacher")}
        >
          Volver a modo profesor
        </Nav.Link>
      )}
    </Nav>
  );
};

export default StudentSidebar;
