import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { fetchWithAuth } from "../../api/api";
import { useNavigate } from "react-router-dom";

const StudentCourses = () => {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await fetchWithAuth("/student/courses");
        setMyCourses(data);
      } catch (error) {
        console.error("Error cargando cursos del estudiante:", error);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  const handleContinue = (courseId) => {
    navigate(`/student/course/${courseId}`);
  };

  const activeCourses = myCourses.filter((course) => !course.completed);
  const completedCourses = myCourses.filter((course) => course.completed);

  return (
    <div className="mt-3">
      <h5>Mis cursos</h5>

      {loading ? (
        <p>Cargando...</p>
      ) : myCourses.length === 0 ? (
        <p>No estás inscrito en ningún curso.</p>
      ) : (
        <>
          {activeCourses.length > 0 && (
            <>
              <h6 className="mt-3">Cursos activos</h6>
              {activeCourses.map((course) => (
                <Card key={course.id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{course.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Profesor: {course.teacherUsername}
                    </Card.Subtitle>
                    <Card.Text>{course.description}</Card.Text>
                    <Button
                      variant="info"
                      className="mt-2"
                      onClick={() => handleContinue(course.id)}
                    >
                      Continuar
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </>
          )}

          {completedCourses.length > 0 && (
            <>
              <h6 className="mt-4">Cursos finalizados</h6>
              {completedCourses.map((course) => (
                <Card key={course.id} className="mb-3" style={{ opacity: 0.6 }}>
                  <Card.Body>
                    <Card.Title>{course.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Profesor: {course.teacherUsername}
                    </Card.Subtitle>
                    <Card.Text>{course.description}</Card.Text>
                    <Button variant="secondary" className="mt-2" disabled>
                      Curso finalizado
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StudentCourses;
