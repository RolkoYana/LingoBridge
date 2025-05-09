import React from "react";
import { Button, Nav } from "react-bootstrap";

const TeacherCourseSidebar = () => {
  return (
    <Nav className="flex-column text-center mt-4">
      <Button variant="outline-secondary" className="w-100 mb-2">
        Inicio
      </Button>
      <Button variant="outline-secondary" className="w-100 mb-2">
        Añadir Material
      </Button>
      <Button variant="outline-secondary" className="w-100">
        Crear Tarea
      </Button>
    </Nav>
  );
};

export default TeacherCourseSidebar;
