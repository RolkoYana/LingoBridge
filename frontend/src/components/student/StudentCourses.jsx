import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { fetchWithAuth } from "../../api/api";

const StudentCourses = () => {
  console.log("Componente montado");
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCourses = async () => {
      console.log("Iniciando carga de cursos...");
      try {
        const data = await fetchWithAuth("/student/courses");
        console.log("Datos recibidos:", data);
        console.log(
          "¿Es array?",
          Array.isArray(data),
          "Longitud:",
          data.length
        );
        setMyCourses(data);
      } catch (error) {
        console.error("Error cargando cursos del estudiante:", error);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  return (
    <div className="mt-3">
      <h5>Mis cursos</h5>
      {loading ? (
        <p>Cargando...</p>
      ) : myCourses.length === 0 ? (
        <p>No estás inscrito en ningún curso.</p>
      ) : (
        myCourses.map((course, i) => (
          <Card key={i} className="mb-3">
            <Card.Body>
              <Card.Title>{course.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Profesor: {course.teacherUsername}
              </Card.Subtitle>
              <Card.Text>{course.description}</Card.Text>
              <Button variant="info" className="mt-2">
                Continuar
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default StudentCourses;
