import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";

const TeacherCourseHeader = ({ courseId }) => {
  const [courseName, setCourseName] = useState("Cargando..."); // almacenar el nombre del curso

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // obtener los cursos del profesor
    if (user && user.courses) {
      // buscar el curso por su id
      const course = user.courses.find((c) => c.id === parseInt(courseId));
      if (course) {
        setCourseName(course.name); // actualizar el estado con el nombre recibido
      }
    }
  }, [courseId]); // dependencia para actualizar si el courseId cambia
  return (
    <Card className="p-3 mb-3">
      <h1>{courseName}</h1>
    </Card>
  );
};

export default TeacherCourseHeader;
