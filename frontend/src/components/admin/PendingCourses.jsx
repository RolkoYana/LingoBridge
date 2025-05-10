import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import ApproveCourse from "./ApproveCourse";
import RejectCourse from "./RejectCourse";

// este componente muestra cursos con approved: false y permite aprobarlos

const PendingCourses = () => {
  const [courses, setCourses] = useState([]);
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
      .then((data) => setCourses(data.filter((course) => !course.approved)))
      .catch((err) => console.error("Error al cargar cursos:", err));
  }, [token]);

  // actualizar la lista tras aprobacion del curso
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
