import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FaUsers, 
  FaBook, 
  FaTasks, 
  FaArrowLeft,
  FaChalkboardTeacher
} from "react-icons/fa";
import "./TeacherCourseSidebar.css";

const TeacherCourseSidebar = ({ setActiveSection, activeSection }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const menuItems = [
    {
      key: "students",
      label: "Estudiantes",
      icon: FaUsers,
      onClick: () => setActiveSection("students")
    },
    {
      key: "material",
      label: "Material",
      icon: FaBook,
      onClick: () => setActiveSection("material")
    },
    {
      key: "create-task",
      label: "Actividades",
      icon: FaTasks,
      onClick: () => setActiveSection("create-task")
    }
  ];

  return (
    <div className="teacher-course-sidebar">
      {/* Header del sidebar */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <FaChalkboardTeacher className="brand-icon" />
          <span className="brand-text">Panel Curso</span>
        </div>
      </div>

      {/* Navegación principal */}
      <Nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.key;
          
          return (
            <Nav.Link
              key={item.key}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={item.onClick}
            >
              <IconComponent className="nav-icon" />
              <span className="nav-text">{item.label}</span>
              {isActive && <div className="active-indicator" />}
            </Nav.Link>
          );
        })}
      </Nav>

      {/* Botón de regreso */}
      <div className="sidebar-footer">
        <Nav.Link
          className="back-button"
          onClick={() => navigate("/teacher")}
        >
          <FaArrowLeft className="nav-icon" />
          <span className="nav-text">Panel Principal</span>
        </Nav.Link>
      </div>
    </div>
  );
};

export default TeacherCourseSidebar;