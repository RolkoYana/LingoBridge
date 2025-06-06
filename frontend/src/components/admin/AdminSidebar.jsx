import React from "react";
import { Nav } from "react-bootstrap";
import {
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaChartLine,
  FaUsers,
  FaGraduationCap,
} from "react-icons/fa";
import "./AdminSidebar.css";

const AdminSidebar = ({ setActiveSection, activeSection, onItemClick }) => {
  
  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Cerrar sidebar en móvil al seleccionar
    if (onItemClick) onItemClick();
  };

  const menuSections = [
    {
      title: "Gestión de Usuarios",
      items: [
        {
          id: "todos-los-usuarios",
          label: "Todos los Usuarios",
          icon: FaUsers,
          onClick: () => handleSectionChange("todos-los-usuarios")
        }
      ]
    },
    {
      title: "Gestión de Cursos",
      items: [
        {
          id: "todos-los-cursos",
          label: "Todos los Cursos",
          icon: FaBook,
          onClick: () => handleSectionChange("todos-los-cursos")
        },
        {
          id: "cursos-activos",
          label: "Cursos Activos",
          icon: FaChalkboardTeacher,
          onClick: () => handleSectionChange("cursos-activos")
        },
        {
          id: "cursos-pendientes",
          label: "Cursos Pendientes",
          icon: FaClipboardList,
          onClick: () => handleSectionChange("cursos-pendientes")
        }
      ]
    },
    {
      title: "Reportes",
      items: [
        {
          id: "estadisticas",
          label: "Estadísticas",
          icon: FaChartLine,
          onClick: () => handleSectionChange("estadisticas")
        }
      ]
    }
  ];

  return (
    <div className="h-100">
      {/* Header del sidebar */}
      <div className="sidebar-header">
        <div className="d-flex align-items-center">
          <div className="admin-logo-mini">
            <FaGraduationCap size={20} />
          </div>
          <h5 className="sidebar-title">Administración</h5>
        </div>
      </div>

      {/* Menú por secciones */}
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="sidebar-section">
          <div className="sidebar-section-title">
            {section.title}
          </div>
          
          {section.items.map((item) => {
            const IconComponent = item.icon;
            return (
              <Nav.Item key={item.id}>
                <Nav.Link
                  className={`sidebar-nav-link ${activeSection === item.id ? "active" : ""}`}
                  onClick={item.onClick}
                  role="button"
                  tabIndex="0"
                  aria-label={item.label}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className="sidebar-icon-wrapper">
                      <IconComponent size={18} />
                    </div>
                    <span className="sidebar-link-text">{item.label}</span>
                  </div>
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </div>
      ))}

    </div>
  );
};

export default AdminSidebar;