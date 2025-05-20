import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaHome, FaClipboardList, FaStickyNote } from "react-icons/fa";

const StudentCourseSidebar = ({ setActiveSection }) => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  return (
    <Nav className="flex-column text-center mt-4">
      {/* Ir a la página de inicio del curso */}
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/student/course/${id}`)}
      >
        <FaHome className="me-2" /> Inicio
      </Nav.Link>

      {/* Sección de Material del curso */}
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("material")}
      >
        <FaStickyNote className="me-2" /> Material
      </Nav.Link>

      {/* Sección de Calificaciones */}
      <Nav.Link
        className="text-white"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSection("grades")}
      >
        <FaClipboardList className="me-2" /> Calificaciones
      </Nav.Link>

      {/* Volver al panel principal del estudiante */}
      <Nav.Link
        className="text-white fw-bold"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/student")}
      >
        Panel Principal
      </Nav.Link>
    </Nav>
  );
};

export default StudentCourseSidebar;
