import React from "react";
import { Nav } from "react-bootstrap";

const AdminSidebar = ({ setActiveSection }) => {
  return (
    <Nav className="flex-column text-center mt-4">
      <Nav.Link
        onClick={() => setActiveSection("inicio")}
        className="text-white my-2"
      >
        Inicio
      </Nav.Link>
      <Nav.Link
        onClick={() => setActiveSection("cursos-activos")}
        className="text-white my-2"
      >
        Cursos Activos
      </Nav.Link>
      <Nav.Link
        onClick={() => setActiveSection("cursos-pendientes")}
        className="text-white my-2"
      >
        Cursos Pendientes
      </Nav.Link>
      <Nav.Link
        onClick={() => setActiveSection("usuarios")}
        className="text-white my-2"
      >
        Usuarios
      </Nav.Link>
      <Nav.Link
        onClick={() => setActiveSection("estadisticas")}
        className="text-white my-2"
      >
        Estadísticas
      </Nav.Link>{" "}
    </Nav>
  );
};

export default AdminSidebar;
