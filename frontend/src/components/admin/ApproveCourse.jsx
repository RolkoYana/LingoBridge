import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/api";

// componente que permite al admin ver y aprobar los cursos

const ApproveCourse = () => {
  const [pendingCourses, setPendingCourses] = useState([]);

  // obtener los cursos pendientes
  useEffect(() => {
    const fetchPendingCourses = async () => {
      try {
        const data = await fetchWithAuth("/pending-courses"); // GET de backend para ver los cursos pendientes
        setPendingCourses(data); //guard la lista de cursos
      } catch (error) {
        alert(error.message);
      }
    };
    fetchPendingCourses();
  }, []);

  // aprobar el curso
  const approveCourse = async (courseId) => {
    try {
      const data = await fetchWithAuth("/approve-course/${courseId}", {
        method: "PUT",
      }); // PUT de backend para aprobar el curso seleccionado
      alert(data.message);
      // eliminar curso aprobado y actualizar la lista de pendientes
      setPendingCourses(pendingCourses.filter((c) => c.id !== courseId));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Cursos Pendientes de aprobar</h2>
      {/* mapear los cursos pendientes y mostrar un boton para aprobar */}
      {pendingCourses.map((course) => (
        <div key={course.id}>
          <p>
            {course.name} - {course.description}
          </p>
          <button onClick={() => approveCourse(course.id)}>
            Aprobar curso
          </button>
        </div>
      ))}
    </div>
  );
};

export default ApproveCourse;
