import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const TeacherCourseSidebar = ({ setActiveSection }) => {
  const navigate = useNavigate();
  const {id} = useParams(); // obtener ID del curso desde URL

  return (
    <Nav className="flex-column text-center mt-4">
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/teacher/course/${id}`)} 
      >
        Inicio
      </Nav.Link>

      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("students")}
      >
        Estudiantes
      </Nav.Link>

      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("material")}
      >
        Material
      </Nav.Link>

      <Nav.Link
        className="text-white fw-bold"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/teacher")} 
      >
        Panel Principal
      </Nav.Link>
    </Nav>
  );
};

export default TeacherCourseSidebar;
