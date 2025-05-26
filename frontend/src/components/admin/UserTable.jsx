import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Card, InputGroup, Form, Spinner, Alert, ButtonGroup } from "react-bootstrap";
import { FaUser, FaEnvelope, FaUserShield, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaUserPlus } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth("/admin/users");
        setUsers(data);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };

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
    if (roles.includes("TEACHER")) return <FaUser className="me-1" />;
    return <FaUser className="me-1" />;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === "all" || user.roles.includes(selectedRole.toUpperCase());
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <Card className="admin-card">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 mb-0">Cargando usuarios...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mb-4">
        <Alert.Heading>¡Oops! Algo salió mal</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <div className="mb-4">
      <Card className="admin-card mb-3">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaUser className="me-2" size={20} />
            <h5 className="mb-0">Gestión de Usuarios</h5>
          </div>
        </Card.Header>
      </Card>

      {/* Controles de búsqueda y filtros */}
      <Card className="admin-card mb-3">
        <Card.Body>
          <div className="row g-3">
            <div className="col-md-8">
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre, apellido, email o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control-themed"
                />
              </InputGroup>
            </div>
            <div className="col-md-4">
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="form-control-themed"
                >
                  <option value="all">Todos los roles</option>
                  <option value="teacher">Profesores</option>
                  <option value="student">Estudiantes</option>
                </Form.Select>
              </InputGroup>
            </div>
          </div>
          
          {/* Estadísticas rápidas */}
          <div className="row mt-3">
            <div className="col-12">
              <div className="d-flex gap-3 flex-wrap">
                <Badge bg="info" className="px-3 py-2">
                  Total: {users.length} usuarios
                </Badge>
                <Badge bg="primary" className="px-3 py-2">
                  Mostrando: {filteredUsers.length}
                </Badge>
                <Badge bg="warning" className="px-3 py-2">
                  Profesores: {users.filter(u => u.roles.includes("TEACHER")).length}
                </Badge>
                <Badge bg="success" className="px-3 py-2">
                  Estudiantes: {users.filter(u => u.roles.includes("STUDENT")).length}
                </Badge>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Tabla principal */}
      <Card className="admin-card">
        <div className="admin-table-container">
          <Table striped hover responsive className="mb-0">
            <thead className="table-primary">
              <tr>
                <th scope="col" className="text-center">#</th>
                <th scope="col">
                  <FaUser className="me-2" />
                  Usuario
                </th>
                <th scope="col">
                  <FaEnvelope className="me-2" />
                  Contacto
                </th>
                <th scope="col">
                  <FaUserShield className="me-2" />
                  Rol
                </th>
                <th scope="col" className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="text-muted">
                      <FaUser size={48} className="mb-3 opacity-50" />
                      <p className="mb-0">No se encontraron usuarios</p>
                      <small>Intenta ajustar los filtros de búsqueda</small>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="align-middle">
                    <td className="text-center">
                      <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" 
                           style={{ width: '32px', height: '32px' }}>
                        <small className="fw-bold text-primary">{user.id}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-bold text-primary mb-1">
                          {user.name} {user.surname}
                        </div>
                        <small className="text-muted">@{user.username}</small>
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
                            className="d-flex align-items-center"
                          >
                            {getRoleIcon([role])}
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="text-center">
                      <ButtonGroup size="sm">
                        <Button 
                          variant="outline-info"
                          title="Ver detalles"
                          className="d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <FaEye size={12} />
                        </Button>
                        <Button 
                          variant="outline-warning"
                          title="Editar usuario"
                          className="d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <FaEdit size={12} />
                        </Button>
                        <Button 
                          variant="outline-danger"
                          title="Eliminar usuario"
                          className="d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <FaTrash size={12} />
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default UserTable;