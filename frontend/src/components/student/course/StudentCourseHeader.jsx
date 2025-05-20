import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { fetchWithAuth } from "../../../api/api";

const StudentCourseHeader = ({ courseId }) => {
  const [courseInfo, setCourseInfo] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await fetchWithAuth(`/student/course/${courseId}`);
        setCourseInfo(data);
      } catch (error) {
        console.error("Error al cargar los datos del curso:", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!courseInfo) {
    return <div>Cargando curso...</div>;
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{courseInfo.name}</Card.Title>
        {/* Mostrar el nombre del profesor */}
        <Card.Subtitle className="text-muted">
          Profesor: {courseInfo.teacherUsername || "No asignado"}
        </Card.Subtitle>
        <Card.Text>{courseInfo.description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default StudentCourseHeader;
