import React, { useState, useEffect } from "react";
import { Row, Col, Dropdown, Badge } from "react-bootstrap";
import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaChevronDown,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TeacherHeader.css";

const TeacherHeader = () => {
  const [user, setUser] = useState({ name: "Profesor" });
  const [notifications, setNotifications] = useState(3); // Simulado
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error al parsear user:", e);
      }
    }
  }, []);

  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="teacher-header-integrated">
      <Row className="align-items-center">
        <Col>
          <div className="welcome-section">
            <h4 className="greeting-text mb-1">
              Hola,{" "}
              <span className="user-name">{user?.name || "Profesor"}</span>!
            </h4>
            <p className="date-text mb-0">{formatDate()}</p>
          </div>
        </Col>
        <Col xs="auto">
          <div className="user-actions d-flex align-items-center">
            {/* Notificaciones */}
            <div className="notification-container me-3">
              <button
                className="notification-btn"
                aria-label={`${notifications} notificaciones pendientes`}
              >
                <FaBell size={18} />
                {notifications > 0 && (
                  <Badge bg="danger" className="notification-badge" pill>
                    {notifications > 9 ? "9+" : notifications}
                  </Badge>
                )}
              </button>
            </div>

            {/* Menú de usuario */}
            <Dropdown align="end" className="user-dropdown">
              <Dropdown.Toggle
                as="div"
                className="user-menu-toggle"
                id="user-dropdown"
                role="button"
                tabIndex="0"
              >
                <div className="d-flex align-items-center">
                  <div className="user-avatar me-2">
                    <FaUserCircle size={32} />
                  </div>
                  <div className="user-info d-none d-md-block me-2">
                    <div className="user-name-small">
                      {user?.name || "Profesor"}
                    </div>
                    <div className="user-role">Profesor</div>
                  </div>
                  <FaChevronDown size={10} className="dropdown-arrow" />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-dropdown-menu">
                <div className="dropdown-header">
                  <div className="d-flex align-items-center">
                    <FaUserCircle size={24} className="me-2" />
                    <div>
                      <div className="fw-bold">{user?.name || "Profesor"}</div>
                      <small className="text-muted">
                        {user?.email || "profesor@lingobride.com"}
                      </small>
                    </div>
                  </div>
                </div>

                <Dropdown.Divider />

                <Dropdown.Item className="dropdown-item-custom">
                  <FaCog className="me-2" />
                  Configuración
                </Dropdown.Item>
                <Dropdown.Divider />

                <Dropdown.Item
                  className="dropdown-item-logout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-2" />
                  Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherHeader;
