import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TeacherSidebar = ({ setActiveSection }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.roles.includes("TEACHER") && user.courses) {
      setCourses(user.courses);
    }
  }, []);

  return (
    <Nav className="flex-column text-center mt-4">
      {/* modo estudiante */}
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/student")}
      >
        Modo estudiante
      </Nav.Link>
      {/* mis cursos - session por defecto al entrar a la pagina */}
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
        onClick={() => setActiveSection("mis-alumnos")}
      >
        Mis alumnos
      </Nav.Link>
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("material")}
      >
        Material
      </Nav.Link>
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("evaluaciones")}
      >
        Evaluaciones
      </Nav.Link>
      <Nav.Link className="text-white">Mensajes</Nav.Link>
    </Nav>
  );
};

export default TeacherSidebar;
