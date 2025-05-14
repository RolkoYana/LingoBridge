import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import ApproveCourse from "./ApproveCourse";
import RejectCourse from "./RejectCourse";
import { fetchWithAuth } from "../../api/api";

// este componente muestra cursos con approved: false y permite aprobarlos

const PendingCourses = () => {
  const [courses, setCourses] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;

  useEffect(() => {
    fetchWithAuth("/admin/pending-courses")
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error al cargar cursos:", err));
  }, []);

  // Actualizar la lista tras aprobación o rechazo de curso
  const removeCourse = (courseId) => {
    setCourses(courses.filter((c) => c.id !== courseId));
  };

  return (
    <div id="pending-courses" className="mb-4">
      <h6>Cursos Pendientes de Aprobación</h6>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td>
                <ApproveCourse courseId={course.id} onApprove={removeCourse} />
                <RejectCourse courseId={course.id} onReject={removeCourse} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PendingCourses;
