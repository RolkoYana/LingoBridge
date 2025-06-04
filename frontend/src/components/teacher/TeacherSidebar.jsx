import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaUsers,
  FaTasks,
  FaEnvelope,
  FaUserGraduate,
  FaBook,
} from "react-icons/fa";
import "./TeacherSidebar.css";

const TeacherSidebar = ({
  setActiveSection,
  activeSection = "mis-cursos",
  onItemClick,
}) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.roles.includes("TEACHER") && user.courses) {
      setCourses(user.courses);
    }
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Cerrar sidebar en móvil al seleccionar
    if (onItemClick) onItemClick();
  };

  const handleStudentMode = () => {
    navigate("/student");
    if (onItemClick) onItemClick();
  };

  const menuItems = [
    {
      key: "mis-cursos",
      label: "Mis cursos",
      icon: <FaBook className="me-2" />,
      onClick: () => handleSectionChange("mis-cursos"),
    },
    {
      key: "mis-alumnos",
      label: "Mis alumnos",
      icon: <FaUsers className="me-2" />,
      onClick: () => handleSectionChange("mis-alumnos"),
    },
    {
      key: "tareas-entregadas",
      label: "Tareas entregadas",
      icon: <FaTasks className="me-2" />,
      onClick: () => handleSectionChange("tareas-entregadas"),
    },
    {
      key: "mensajes",
      label: "Mensajes",
      icon: <FaEnvelope className="me-2" />,
      onClick: () => handleSectionChange("mensajes"),
    },
  ];

  return (
    <Nav
      className="flex-column h-100"
      role="navigation"
      aria-label="Menú principal del profesor"
    >
      {/* Modo estudiante - Destacado */}
      <Nav.Link
        className="nav-link student-mode text-center mb-3 mt-4"
        onClick={handleStudentMode}
        role="button"
        tabIndex="0"
        aria-label="Cambiar a modo estudiante"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleStudentMode();
          }
        }}
      >
        <FaUserGraduate className="me-2" />
        Modo estudiante
      </Nav.Link>

      {/* Separador visual */}
      <hr className="text-white mx-3 opacity-25" />

      {/* Menú principal */}
      {menuItems.map((item) => (
        <Nav.Link
          key={item.key}
          className={`nav-link d-flex align-items-center ${
            activeSection === item.key ? "active" : ""
          }`}
          onClick={item.onClick}
          role="button"
          tabIndex="0"
          aria-label={item.label}
          aria-current={activeSection === item.key ? "page" : undefined}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              item.onClick();
            }
          }}
        >
          {item.icon}
          <span>{item.label}</span>
        </Nav.Link>
      ))}
    </Nav>
  );
};

export default TeacherSidebar;
