import React, { useState, useEffect } from "react";
import { Table, Card } from "react-bootstrap";
import { fetchWithAuth } from "../../api/api";

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await fetchWithAuth("/teacher/students"); //endpoint de backend
        setStudents(data);
      } catch (error) {
        console.log("Error al obtener estudiantes:", error);
      }
    };
    fetchStudents();
  }, []);

  return (
    <Card className="p-4">
      <h3>Mis Alumnos</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Nombre de usuario</th>
            <th>Curso Inscrito</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.username}>
                {" "}
                {/* Usa un identificador único como `username` */}
                <td>{student.name}</td>
                <td>{student.surname}</td>
                <td>{student.username}</td>
                <td>{student.courseName}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No hay estudiantes inscritos.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
};

export default TeacherStudents;
