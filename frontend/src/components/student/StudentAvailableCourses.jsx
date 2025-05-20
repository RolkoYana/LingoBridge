import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { fetchWithAuth } from "../../api/api";

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);

  // cargar cursos disponibles
  const loadCourses = () => {
    fetchWithAuth("/student/available-courses")
      .then((data) => {
        setCourses(data);
      })
      .catch((err) => console.error("Error al cargar cursos:", err));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // inscribirse en un curso
  const enrollInCourse = (courseId) => {
    fetchWithAuth(`/student/enroll/${courseId}`, {
      method: "POST",
    })
      .then((data) => {
        if (data) {
          alert("Inscripción exitosa");
          // eliminar curso de la lista (pero no de BD)
          setCourses((prevCourses) =>
            prevCourses.filter((course) => course.id !== courseId)
          );
        } else {
          alert("Hubo un problema con la inscripción");
        }
      })
      .catch((err) => console.error("Error al inscribir en el curso:", err));
  };

  return (
    <div>
      <h6>Cursos Disponibles</h6>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Modalidad</th>
            <th>Profesor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td>{course.type}</td>
              <td>
                {course.teacher
                  ? `${course.teacher.name} ${course.teacher.surname}`
                  : "No asignado"}
              </td>
              <td>
                <Button
                  variant="success"
                  onClick={() => enrollInCourse(course.id)}
                >
                  Inscribirse
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AvailableCourses;
