import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

const UserTable = () => {
  const [users, setUsers] = useState([]);

  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;

  useEffect(() => {
    if (!token) {
      return <p>No autorizado. Por favor inicia sesión.</p>;
    }
    fetch("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error("Error al cargar usuarios:", err));
    }, [token]);

  return (
    <div id="users" className="mb-4">
      <h6>Usuarios registrados</h6>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Rol</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.roles.join(", ")}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="success" size="sm">
                  Activar
                </Button>
                <Button variant="warning" size="sm">
                  Desactivar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;
