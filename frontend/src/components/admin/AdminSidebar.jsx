// src/components/admin/AdminSidebar.jsx
import React from "react";
import { Nav } from "react-bootstrap";
import {
  FaUserCog,
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaChartLine,
  FaUsers,
  FaGraduationCap,
} from "react-icons/fa";

const AdminSidebar = ({ setActiveSection, activeSection }) => {
  const menuSections = [
    {
      title: "Gestión de Usuarios",
      items: [
        {
          id: "todos-los-usuarios",
          label: "Todos los Usuarios",
          icon: FaUsers,
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
        },
        {
          id: "cursos-activos",
          label: "Cursos Activos",
          icon: FaChalkboardTeacher,
        },
        {
          id: "cursos-pendientes",
          label: "Cursos Pendientes",
          icon: FaClipboardList,
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
        }
      ]
    }
  ];

  return (
    <Nav className="admin-sidebar flex-column p-3">
      <div className="sidebar-header mb-4">
        <div className="d-flex align-items-center">
          <div className="admin-logo-mini me-2">
            <FaGraduationCap size={20} />
          </div>
          <h5 className="sidebar-title mb-0">Administración</h5>
        </div>
      </div>

      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="sidebar-section mb-3">
          <div className="sidebar-section-title mb-2">
            {section.title}
          </div>
          
          {section.items.map((item) => {
            const IconComponent = item.icon;
            return (
              <Nav.Item key={item.id}>
                <Nav.Link
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`sidebar-nav-link ${activeSection === item.id ? "active" : ""}`}
                >
                  <div className="d-flex align-items-center">
                    <div className="sidebar-icon-wrapper me-3">
                      <IconComponent size={18} />
                    </div>
                    <span className="sidebar-link-text">{item.label}</span>
                  </div>
                  {activeSection === item.id && (
                    <div className="active-indicator"></div>
                  )}
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </div>
      ))}
    </Nav>
  );
};

export default AdminSidebar;