import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import AssignCourse from "./AssignCourse";
import CompleteCourse from "./CompleteCourse";

// este componente muestra cursos con approved:true y permite asignarlos o finalizarlos

const ActiveCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;

  useEffect(() => {
    fetch("http://localhost:8080/api/courses", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setCourses(data.filter((course) => course.approved)))
      .catch((err) => console.error("Error al cargar cursos:", err));
  }, [token]);

  // actualizar la lista tras asignar un profesor
  const updateCourse = (courseId, teacherUsername) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? { ...course, teacher: { username: teacherUsername } }
          : course
      )
    );
  };

  // eliminar el curso de la lista tras finalizarlo
  const removeCourse = (courseId) => {
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  return (
    <div>
      <h6>Cursos Activos</h6>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Profesor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.teacher?.username || "No asignado"}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  Asignar Profesor
                </Button>
                <CompleteCourse
                  courseId={course.id}
                  onComplete={removeCourse}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedCourseId && (
        <AssignCourse courseId={selectedCourseId} onAssign={updateCourse} />
      )}
    </div>
  );
};

export default ActiveCourses;
