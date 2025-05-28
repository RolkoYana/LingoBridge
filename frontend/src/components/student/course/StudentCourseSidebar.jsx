import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FaHome, 
  FaClipboardList, 
  FaStickyNote, 
  FaTasks,
  FaChartLine,
  FaComments,
  FaArrowLeft,
  FaBook
} from "react-icons/fa";

const StudentCourseSidebar = ({ setActiveSection, activeSection }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const menuItems = [
    {
      id: "home",
      label: "Inicio del Curso",
      icon: FaHome,
      action: () => setActiveSection("home"),
      isActive: activeSection === "home"
    },
    {
      id: "activities",
      label: "Actividades",
      icon: FaTasks,
      action: () => setActiveSection("activities"),
      isActive: activeSection === "activities"
    },
    {
      id: "material",
      label: "Material",
      icon: FaStickyNote,
      action: () => setActiveSection("material"),
      isActive: activeSection === "material"
    },
    {
      id: "grades",
      label: "Calificaciones",
      icon: FaClipboardList,
      action: () => setActiveSection("grades"),
      isActive: activeSection === "grades"
    },
    {
      id: "progress",
      label: "Mi Progreso",
      icon: FaChartLine,
      action: () => setActiveSection("progress"),
      isActive: activeSection === "progress"
    },
    {
      id: "messages",
      label: "Mensajes",
      icon: FaComments,
      action: () => setActiveSection("messages"),
      isActive: activeSection === "messages"
    }
  ];

  return (
    <div className="sidebar-container">
      {/* Header del sidebar */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <FaBook className="logo-icon" />
          <span className="logo-text">Mi Curso</span>
        </div>
        <div className="course-id">ID: {id}</div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h4 className="nav-section-title">Navegación</h4>
          <ul className="nav-list">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-link ${item.isActive ? 'active' : ''}`}
                    onClick={item.action}
                  >
                    <IconComponent className="nav-icon" />
                    <span className="nav-text">{item.label}</span>
                    {item.isActive && <div className="active-indicator"></div>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Footer del sidebar */}
      <div className="sidebar-footer">
        <button
          className="back-btn"
          onClick={() => navigate("/student")}
        >
          <FaArrowLeft className="back-icon" />
          <span>Volver al Panel</span>
        </button>
      </div>
    </div>
  );
};

export default StudentCourseSidebar;