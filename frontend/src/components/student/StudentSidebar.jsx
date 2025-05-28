import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  FaBook, 
  FaSearch, 
  FaGraduationCap, 
  FaStar,
  FaEnvelope,
  FaChalkboardTeacher
} from "react-icons/fa";

const StudentSidebar = ({ setActiveSection, activeSection = "mis-cursos", onItemClick }) => {
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

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Cerrar sidebar en móvil al seleccionar
    if (onItemClick) onItemClick();
  };

  const handleTeacherMode = () => {
    navigate("/teacher");
    if (onItemClick) onItemClick();
  };

  const menuItems = [
    {
      key: "cursos-disponibles",
      label: "Cursos Disponibles",
      icon: <FaSearch className="me-2" />,
      onClick: () => handleSectionChange("cursos-disponibles")
    },
    {
      key: "mis-cursos",
      label: "Mis cursos",
      icon: <FaBook className="me-2" />,
      onClick: () => handleSectionChange("mis-cursos")
    },
    {
      key: "evaluaciones",
      label: "Mis Evaluaciones",
      icon: <FaStar className="me-2" />,
      onClick: () => handleSectionChange("evaluaciones")
    },
    {
      key: "chat",
      label: "Mensajes",
      icon: <FaEnvelope className="me-2" />,
      onClick: () => handleSectionChange("chat")
    }
  ];

  return (
    <Nav className="flex-column h-100" role="navigation" aria-label="Menú principal del estudiante">
      
      {/* Menú principal */}
      {menuItems.map((item) => (
        <Nav.Link
          key={item.key}
          className={`nav-link d-flex align-items-center ${
            activeSection === item.key ? 'active' : ''
          }`}
          onClick={item.onClick}
          role="button"
          tabIndex="0"
          aria-label={item.label}
          aria-current={activeSection === item.key ? 'page' : undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              item.onClick();
            }
          }}
        >
          {item.icon}
          <span>{item.label}</span>
        </Nav.Link>
      ))}

      {/* Separador visual si hay botón de profesor */}
      {showTeacherButton && (
        <hr className="text-white mx-3 opacity-25" />
      )}

      {/* Botón para volver a modo profesor */}
      {showTeacherButton && (
        <Nav.Link
          className="nav-link teacher-mode text-center"
          onClick={handleTeacherMode}
          role="button"
          tabIndex="0"
          aria-label="Cambiar a modo profesor"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTeacherMode();
            }
          }}
        >
          <FaChalkboardTeacher className="me-2" />
          Modo Profesor
        </Nav.Link>
      )}

      {/* Información adicional al final */}
      <div className="mt-auto p-3 text-center">
        <small className="text-white-50">
          Panel del Estudiante
        </small>
      </div>
    </Nav>
  );
};

export default StudentSidebar;