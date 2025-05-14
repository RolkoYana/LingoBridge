import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudentSidebar = ({ setActiveSection }) => {
  const [showCourses, setShowCourses] = useState(false); // para controlar si el menu de cursos esta desplegado o no
  const [courses, setCourses] = useState([]); // para almacenar los cursos del estudiante
  const navigate = useNavigate();

  // obtener los cursos cuando el componente se monta
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // obtener usuario desde localStorage

    if (user && user.roles.includes("STUDENT") && user.courses) {
      setCourses(user.courses); // los cursos deben existir en la API de login
    }
  }, []); // [] - hace que el efecto se ejecute solo una vez al montar el componente

  return (
    <Nav className="flex-column text-center mt-4">
      <Nav.Link href="#" className="text-white">
        Inicio
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
        Evaluaciones
      </Nav.Link>

      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("chat")}
      >
        Mensajes
      </Nav.Link>
    </Nav>
  );
};

export default StudentSidebar;
