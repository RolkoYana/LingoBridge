import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import AssignCourse from "./AssignCourse";
import CompleteCourse from "./CompleteCourse";
import { fetchWithAuth } from "../../api/api";

const ActiveCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

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

  const removeCourse = (courseId) => {
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  return (
    <div>
      <h6>Cursos Activos</h6>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th> {/* Nueva columna para el ID */}
            <th>Nombre</th>
            <th>Profesor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td> {/* Mostrar el ID aquí */}
              <td>{course.name}</td>
              <td>
                {course.teacher
                  ? `${course.teacher.name} ${course.teacher.surname} (${course.teacher.username})`
                  : "No asignado"}
              </td>
              <td>
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
