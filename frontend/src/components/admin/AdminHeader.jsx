import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputGroup, Dropdown, Badge } from "react-bootstrap";
import { FaUserCircle, FaBell, FaSearch, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const [user, setUser] = useState({ name: "Admin" });
  const [notifications] = useState(3); // ejemplo de notificaciones
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Row className="admin-header align-items-center py-3 px-4 shadow-sm">
      <Col xs={12} md={4} className="mb-2 mb-md-0">
        <div className="d-flex align-items-center">
          <div className="admin-logo-circle me-3">
            <FaCog size={24} className="admin-icon-color" />
          </div>
          <div>
            <h5 className="mb-0">
              ¡Bienvenido, <strong>{user?.name || "Admin"}</strong>!
            </h5>
            <small className="text-muted">Panel de Administración</small>
          </div>
        </div>
      </Col>
      
      <Col xs={12} md={5} className="mb-2 mb-md-0">
        <InputGroup className="admin-search-group">
          <InputGroup.Text className="bg-transparent border-end-0">
            <FaSearch className="text-muted" />
          </InputGroup.Text>
          <Form.Control 
            type="text" 
            placeholder="Buscar usuarios, cursos..." 
            className="admin-search-input form-control-themed border-start-0" 
          />
        </InputGroup>
      </Col>
      
      <Col xs={12} md={3} className="text-md-end">
        <div className="d-flex align-items-center justify-content-md-end gap-3">
          {/* Notificaciones con badge */}
          <div className="position-relative">
            <FaBell size={20} className="admin-icon-color" style={{ cursor: "pointer" }} />
            {notifications > 0 && (
              <Badge 
                bg="danger" 
                pill 
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: "0.7rem" }}
              >
                {notifications}
              </Badge>
            )}
          </div>
          
          <Dropdown align="end">
            <Dropdown.Toggle
              as="div"
              style={{ cursor: "pointer" }}
              id="dropdown-user"
              className="admin-icon-color d-flex align-items-center"
            >
              <FaUserCircle size={32} />
            </Dropdown.Toggle>

            <Dropdown.Menu className="admin-dropdown-menu shadow">
              <Dropdown.Header>
                <div className="text-center">
                  <FaUserCircle size={40} className="mb-2 text-primary" />
                  <div className="fw-bold">{user?.name || "Admin"}</div>
                  <small className="text-muted">Administrador</small>
                </div>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item href="#perfil">
                <FaUserCircle className="me-2" /> Perfil
              </Dropdown.Item>
              <Dropdown.Item href="#configuracion">
                <FaCog className="me-2" /> Configuración
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Col>
    </Row>
  );
};

export default AdminHeader;