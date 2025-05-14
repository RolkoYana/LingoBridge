import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import AssignCourse from "./AssignCourse";
import CompleteCourse from "./CompleteCourse";
import { fetchWithAuth } from "../../api/api";

// este componente muestra cursos con approved:true y permite asignarlos o finalizarlos

const ActiveCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // cargar cursos activos
  const loadCourses = () => {
    fetchWithAuth("/admin/active-courses")
      .then((data) =>
        setCourses(
          data.filter((course) => course.approved && !course.completed)
        )
      )
      .catch((err) => console.error("Error al cargar cursos:", err));
  };

  useEffect(() => {
    loadCourses();
  }, []);

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
              <td>
                {course.teacher
                  ? `${course.teacher.name} ${course.teacher.surname} (${course.teacher.username})`
                  : "No asignado"}
              </td>

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
        <AssignCourse
          courseId={selectedCourseId}
          onAssign={() => {
            loadCourses();
            setSelectedCourseId(null);
          }}
        />
      )}
    </div>
  );
};

export default ActiveCourses;
