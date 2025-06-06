import React, { useState, useEffect } from "react";
import { Row, Col, Dropdown, Badge } from "react-bootstrap";
import {
  FaUserCircle,
  FaBell,
  FaChevronDown,
  FaGraduationCap,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AdminHeader.css";

const AdminHeader = ({ name }) => {
  const [user, setUser] = useState({ name: name || "Admin" });
  const [notifications] = useState(5); // ejemplo de notificaciones
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, name: name || parsedUser.name || "Admin" });
      } catch (e) {
        console.error("Error al parsear user:", e);
        setUser({ name: name || "Admin" });
      }
    } else {
      setUser({ name: name || "Admin" });
    }
  }, [name]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString("es-ES", options);
  };

  return (
    <div className="admin-header-integrated">
      <Row className="align-items-center">
        {/* Saludo y fecha */}
        <Col xs={12} md={8} className="mb-2 mb-md-0">
          <div>
            <h4 className="greeting-text mb-1">
              Hola, <span className="user-name">{user?.name || "Admin"}</span>!
            </h4>
            <p className="subtitle-text mb-0">{getCurrentDate()}</p>
          </div>
        </Col>

        {/* Notificaciones y usuario */}
        <Col xs={12} md={4}>
          <div className="d-flex align-items-center justify-content-md-end gap-3">
            {/* Notificaciones */}
            <div className="notification-container">
              <button className="notification-btn" title="Notificaciones">
                <FaBell size={20} />
                {notifications > 0 && (
                  <Badge bg="danger" pill className="notification-badge">
                    {notifications}
                  </Badge>
                )}
              </button>
            </div>

            {/* Dropdown de usuario */}
            <Dropdown align="end" className="user-dropdown">
              <Dropdown.Toggle
                as="div"
                className="user-menu-toggle"
                id="dropdown-user"
              >
                <div className="d-flex align-items-center">
                  <FaUserCircle size={28} className="user-avatar me-2" />
                  <div className="user-info d-none d-sm-block">
                    <div className="user-name-small">
                      {user?.name || "Admin"}
                    </div>
                    <div className="user-role">Administrador</div>
                  </div>
                  <FaChevronDown size={12} className="dropdown-arrow ms-2" />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-dropdown-menu">
                <Dropdown.Header>
                  <div className="text-center">
                    <FaUserCircle size={40} className="mb-2 text-primary" />
                    <div className="fw-bold">{user?.name || "Admin"}</div>
                    <small className="text-muted">
                      Administrador del Sistema
                    </small>
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item className="dropdown-item-custom">
                  <FaGraduationCap className="me-2" /> Configuración
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={handleLogout}
                  className="dropdown-item-logout"
                >
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

export default AdminHeader;
