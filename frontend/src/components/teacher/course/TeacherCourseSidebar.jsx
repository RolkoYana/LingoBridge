import React from "react";
import { Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TeacherCourseSidebar = ({ setActiveSection }) => {
  const navigate = useNavigate();

  return (
    <Nav className="flex-column text-center mt-4">
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/teacher")}
      >
        Inicio
      </Nav.Link>
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("add-material")}
      >
        Añadir Material
      </Nav.Link>

      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("create-task")}
      >
        Crear Tarea
      </Nav.Link>
    </Nav>
  );
};

export default TeacherCourseSidebar;
