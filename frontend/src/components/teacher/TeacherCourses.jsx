import React, { useEffect, useState } from "react";
import { Table, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../api/api";

const TeacherCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await fetchWithAuth("/teacher/courses");
        console.log("Cursos obtenidos:", data); // depuracion
        setCourses(data);
      } catch (error) {
        console.log("Error al obtener cursos:", error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <Card className="p-4">
      <h3>Mis Cursos</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre del curso</th>
            <th>Descripción</th>
            <th>Modalidad</th>
            <th>Cantidad de alumnos</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.id}>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>
                  {course.type.charAt(0).toUpperCase() + course.type.slice(1)}
                </td>
                <td>{course.numberOfStudents}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/teacher/course/${course.id}`)} // redirige a la página de curso
                  >
                    Ver Curso
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No tienes cursos asignados.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
};

export default TeacherCourses;
