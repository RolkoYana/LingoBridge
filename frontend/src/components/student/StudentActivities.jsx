import React, { useEffect, useState } from "react";
import { ListGroup, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../api/api";

const StudentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadActivitiesFromAllCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const courses = await fetchWithAuth("/student/courses");
        if (!Array.isArray(courses)) {
          throw new Error("Error al obtener los cursos.");
        }

        const allActivities = [];

        for (const course of courses) {
          const courseActivities = await fetchWithAuth(
            `/student/course/${course.id}/activity`
          );

          if (Array.isArray(courseActivities)) {
            courseActivities.forEach((activity) => {
              allActivities.push({
                ...activity,
                courseName: course.name,
                courseId: course.id, // importante para navegar
              });
            });
          }
        }

        const pending = allActivities
          .filter((a) => !a.completed)
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        setActivities(pending);
      } catch (err) {
        console.error("Error cargando actividades:", err);
        setError("No se pudieron cargar las actividades.");
      } finally {
        setLoading(false);
      }
    };

    loadActivitiesFromAllCourses();
  }, []);

  const handleClick = (activity) => {
    if (activity.completed) return;

    const { courseId, id: activityId, type } = activity;

    if (type === "TASK") {
      navigate(`/student/course/${courseId}/task/${activityId}`);
    } else if (type === "TEST") {
      navigate(`/student/course/${courseId}/test/${activityId}`);
    } else {
      // Opcional: manejar otros tipos o mostrar mensaje
      console.warn("Tipo de actividad desconocido:", type);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (activities.length === 0) {
    return <p>No tienes actividades pendientes.</p>;
  }

  return (
    <div className="mt-3">
      <h5>Próximas actividades</h5>
      <ListGroup>
        {activities.map((a, i) => (
          <ListGroup.Item
            key={i}
            onClick={() => handleClick(a)}
            style={{
              cursor: a.completed ? "default" : "pointer",
              opacity: a.completed ? 0.7 : 1,
            }}
          >
            <strong>{a.title}</strong> <br />
            <small>
              Curso: <b>{a.courseName}</b> | Fecha límite: {a.dueDate}
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default StudentActivities;
