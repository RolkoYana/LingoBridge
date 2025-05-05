import React from "react";
import { Nav } from "react-bootstrap";
import { FaHome, FaClipboardList, FaStickyNote } from "react-icons/fa";

const StudentCourseSidebar = () => {
  return (
    <Nav className="flex-column text-center mt-4">
      <Nav.Link href="#" className="text-white">
        <FaHome className="me-2" /> Inicio
      </Nav.Link>
      <Nav.Link href="#" className="text-white">
        <FaClipboardList className="me-2" /> Calificaciones
      </Nav.Link>
      <Nav.Link href="#" className="text-white">
        <FaStickyNote className="me-2" /> Notas del Profesor
      </Nav.Link>
    </Nav>
  );
};

export default StudentCourseSidebar;
