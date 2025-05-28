import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import { fetchWithAuth } from "../../../api/api";

const TeacherCourseHeader = ({ course }) => {
  if (!course) return <p>Error al cargar el curso</p>;

  return (
    <Card className="p-3 mb-3">
      <h1>{course.name}</h1>
      <p className="mb-1">{course.description}</p>
      <small>
        Tipo: <strong>{course.type}</strong> | Aprobado:{" "}
        <strong>{course.approved ? "Sí" : "No"}</strong> | Alumnos:{" "}
        <strong>{course.numberOfStudents ?? 0}</strong>
      </small>
    </Card>
  );
};

export default TeacherCourseHeader;
