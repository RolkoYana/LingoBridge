import React, { useEffect, useState } from "react";
import { ListGroup, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../api/api";

const StudentCourseActivities = ({ courseId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!courseId) {
          setError("No se ha proporcionado un curso válido.");
          return;
        }

        console.log("Cargando actividades para courseId:", courseId);
        const data = await fetchWithAuth(
          `/student/course/${courseId}/activity`
        );

        console.log("Actividades recibidas:", data);

        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          console.warn("Los datos recibidos no son un array:", data);
          setActivities([]);
        }
      } catch (error) {
        console.error("Error cargando las actividades:", error);
        setError("Error al cargar las actividades: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [courseId]);

  const handleClick = (activity) => {
    if (activity.completed) return;

    console.log("Actividad seleccionada:", activity);
    console.log(
      "Navegando con courseId:",
      courseId,
      "activityId:",
      activity.id
    );

    if (activity.type === "TASK") {
      // Usar activityId en lugar de taskId para mantener consistencia
      navigate(`/student/course/${courseId}/task/${activity.id}`);
    } else if (activity.type === "TEST") {
      navigate(`/student/course/${courseId}/test/${activity.id}`);
    } else {
      console.warn("Tipo de actividad desconocido:", activity);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center">
        <h5>No hay actividades disponibles</h5>
      </div>
    );
  }

  return (
    <div>
      <h4>Actividades</h4>
      <ListGroup>
        {activities.map((activity) => (
          <ListGroup.Item
            key={activity.id}
            style={{
              cursor: activity.completed ? "default" : "pointer",
              opacity: activity.completed ? 0.7 : 1,
            }}
            onClick={() => handleClick(activity)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <strong>{activity.title}</strong>
                <div style={{ marginTop: 4 }}>{activity.description}</div>
                <small style={{ color: "#666" }}>
                  Tipo: {activity.type} | ID: {activity.id}
                </small>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    whiteSpace: "nowrap",
                    color: "#888",
                    fontSize: "0.9em",
                  }}
                >
                  Fecha límite: {activity.dueDate}
                </div>

                {activity.completed && (
                  <span
                    style={{
                      color: "green",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}
                  >
                    Hecha
                  </span>
                )}
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default StudentCourseActivities;
