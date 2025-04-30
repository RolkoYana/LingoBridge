import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

const CourseTable = () => {
  const [courses, setCourses] = useState([]);

  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;

  useEffect(() => {
    if (!token) {
      return <p>No autorizado. Por favor inicia sesión.</p>;
    }

    fetch("http://localhost:8080/api/courses", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: No autorizado`);
        }

        res.json();
      })
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error al cargar cursos:", err));
  }, [token]);

  return (
    <div id="courses" className="mb-4">
      <h6>Cursos pendientes de aprobación</h6>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Aprobado</th>
            <th>Profesor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td>{course.approved ? "si" : "No"}</td>
              <td>
                {course.teacher?.name} {course.teacher?.surname}
              </td>
              <td>
                <Button variant="success" size="sm">
                  Aprobar
                </Button>
                <Button variant="danger" size="sm">
                  Rechazar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CourseTable;
