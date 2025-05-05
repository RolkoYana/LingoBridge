import React from "react";
import { Card } from "react-bootstrap";

const StudentCourseHeader = () => {
  return (
    <Card className="p-3 mb-3">
      <h1>Nombre del Curso - Nivel</h1>
      <p>Profesor: Nombre del Profesor | Duración: 6 semanas</p>
    </Card>
  );
};

export default StudentCourseHeader;
