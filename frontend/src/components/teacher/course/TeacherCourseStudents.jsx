import React from "react";
import { Card, Button } from "react-bootstrap";

const TeacherCourseStudents = () => {
  return (
    <Card className="p-3 mb-3">
      <h2>Alumnos</h2>
      <p>Lista de alumnos inscritos en el curso</p>
      <Button variant="primary">Evaluar</Button>
    </Card>
  );
};

export default TeacherCourseStudents;
