import React, { useEffect, useState } from "react";
import { Table, Button, Badge, InputGroup, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaUser, FaEnvelope, FaUserShield, FaSearch, FaFilter, FaUsers, FaSyncAlt, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWithAuth("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getRoleBadgeVariant = (roles) => {
    if (roles.includes("ADMIN")) return "danger";
    if (roles.includes("TEACHER")) return "warning";
    if (roles.includes("STUDENT")) return "success";
    return "secondary";
  };

  const getRoleIcon = (roles) => {
    if (roles.includes("ADMIN")) return <FaUserShield className="me-1" />;
    if (roles.includes("TEACHER")) return <FaChalkboardTeacher className="me-1" />;
    if (roles.includes("STUDENT")) return <FaUserGraduate className="me-1" />;
    return <FaUser className="me-1" />;
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      "ADMIN": "Administrador",
      "TEACHER": "Profesor", 
      "STUDENT": "Estudiante"
    };
    return roleNames[role] || role;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === "all" || user.roles.includes(selectedRole.toUpperCase());
    
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    showing: filteredUsers.length,
    teachers: users.filter(u => u.roles.includes("TEACHER")).length,
    students: users.filter(u => u.roles.includes("STUDENT")).length,
    admins: users.filter(u => u.roles.includes("ADMIN")).length
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="unified-section">
        <div className="section-content">
          <div className="empty-section">
            <FaUsers size={48} className="empty-icon" />
            <h5 className="empty-title">Error al cargar usuarios</h5>
            <p className="empty-text">{error}</p>
            <Button className="btn-admin-primary" onClick={loadUsers}>
              <FaSyncAlt className="me-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="unified-section">
      {/* Header de la sección */}
      <div className="section-header">
        <Row className="align-items-center">
          <Col>
            <h2 className="section-title">
              <FaUsers className="header-icon me-3" />
              Gestión de Usuarios
            </h2>
            <p className="section-subtitle">
              Información sobre todos los usuarios del sistema
            </p>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2 flex-wrap">
              <Badge bg="light" text="dark" className="px-3 py-2">
                <strong>Total: {stats.total}</strong>
              </Badge>
              <Badge bg="warning" className="px-3 py-2">
                <strong>Profesores: {stats.teachers}</strong>
              </Badge>
              <Badge bg="success" className="px-3 py-2">
                <strong>Estudiantes: {stats.students}</strong>
              </Badge>
            </div>
          </Col>
        </Row>
      </div>

      {/* Contenido de la sección */}
      <div className="section-content">
        <div className="p-4">
          {/* Controles de búsqueda y filtros */}
          <Row className="mb-4">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre, apellido, email o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <div className="d-flex gap-2">
                <InputGroup className="flex-grow-1">
                  <InputGroup.Text>
                    <FaFilter />
                  </InputGroup.Text>
                  <Form.Select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="all">Todos los roles</option>
                    <option value="admin">Administradores</option>
                    <option value="teacher">Profesores</option>
                    <option value="student">Estudiantes</option>
                  </Form.Select>
                </InputGroup>
                <Button 
                  className="btn-admin-primary"
                  onClick={loadUsers}
                  title="Actualizar lista"
                >
                  <FaSyncAlt />
                </Button>
              </div>
            </Col>
          </Row>

          {/* Mostrar filtro activo */}
          {(searchTerm || selectedRole !== "all") && (
            <div className="mb-3">
              <Badge bg="info" className="px-3 py-2">
                Mostrando {stats.showing} de {stats.total} usuarios
                {searchTerm && ` • Búsqueda: "${searchTerm}"`}
                {selectedRole !== "all" && ` • Rol: ${getRoleDisplayName(selectedRole.toUpperCase())}`}
              </Badge>
            </div>
          )}

          {/* Tabla de usuarios */}
          <div className="table-responsive">
            <Table className="admin-table mb-0">
              <thead>
                <tr>
                  <th width="80">#</th>
                  <th>
                    <FaUser className="me-2" />
                    Usuario
                  </th>
                  <th>
                    <FaEnvelope className="me-2" />
                    Contacto
                  </th>
                  <th width="200">
                    <FaUserShield className="me-2" />
                    Roles
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div className="empty-section">
                        <FaUsers size={48} className="empty-icon" />
                        <h5 className="empty-title">
                          {searchTerm || selectedRole !== "all" 
                            ? "No se encontraron usuarios" 
                            : "No hay usuarios registrados"}
                        </h5>
                        <p className="empty-text">
                          {searchTerm || selectedRole !== "all" 
                            ? "No se encontraron usuarios con los filtros aplicados" 
                            : "Los usuarios aparecerán aquí cuando se registren en el sistema"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex justify-content-center">
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                               style={{ width: "35px", height: "35px", fontSize: "0.85rem", fontWeight: "600" }}>
                            {user.id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold text-primary">
                            {user.name} {user.surname}
                          </div>
                          <div className="text-muted small">@{user.username}</div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaEnvelope className="text-muted me-2" size={14} />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <Badge 
                              key={role} 
                              bg={getRoleBadgeVariant([role])}
                              className="d-flex align-items-center px-2 py-1"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {getRoleIcon([role])}
                              {getRoleDisplayName(role)}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Footer con información */}
          {filteredUsers.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <small className="text-muted">
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </small>
              <small className="text-muted">
                Última actualización: {new Date().toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTable;