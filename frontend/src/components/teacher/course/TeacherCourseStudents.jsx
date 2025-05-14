import React, { useState, useEffect } from "react";
import { Card, Button, Table } from "react-bootstrap";
import { fetchWithAuth } from "../../../api/api";

const TeacherCourseStudents = ({ courseId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!courseId) return;

      setLoading(true); // Cambiamos el estado de carga a true
      try {
        const response = await fetchWithAuth(
          `/teacher/course/${courseId}/students`
        );

        console.log("Respuesta de la API:", response); // Verifica que esta respuesta sea correcta
        setStudents(response); // Establecemos los estudiantes correctamente
      } catch (error) {
        setError("Hubo un problema al obtener los estudiantes.");
        console.error("Error al obtener estudiantes:", error);
      } finally {
        setLoading(false); // Cambiamos el estado de carga a false
      }
    };

    fetchStudents();
  }, [courseId]);

  // Estado de carga
  if (loading) {
    return <p>Cargando estudiantes...</p>;
  }

  // Si hay error
  if (error) {
    return <p>{error}</p>;
  }

  // Si no hay estudiantes
  if (!students || students.length === 0) {
    return (
      <Card className="p-3 mb-3">
        <h2>Alumnos</h2>
        <p>No hay alumnos inscritos en este curso.</p>
      </Card>
    );
  }

  // Renderizamos la tabla con estudiantes
  return (
    <Card className="p-3 mb-3">
      <h2>Alumnos</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{`${student.name} ${student.surname}`}</td>
              <td>
                <Button variant="primary">Evaluar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default TeacherCourseStudents;
