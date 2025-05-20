import React, { useState, useEffect } from "react";
import { Card, ListGroup, Collapse, Spinner } from "react-bootstrap";
import { fetchWithAuth } from "../../../api/api";

const TeacherCourseActivities = ({ courseId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedActivityId, setExpandedActivityId] = useState(null);
  const [testDetails, setTestDetails] = useState({});
  const [loadingTestId, setLoadingTestId] = useState(null);

  const fetchActivities = async () => {
    try {
      const data = await fetchWithAuth(`/teacher/activity/course/${courseId}`);
      setActivities(data);
    } catch (error) {
      console.error("Error al cargar las actividades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [courseId]);

  const toggleExpand = async (activity) => {
    const isOpen = expandedActivityId === activity.id;
    setExpandedActivityId(isOpen ? null : activity.id);

    if (!isOpen && activity.type === "TEST" && !testDetails[activity.id]) {
      try {
        setLoadingTestId(activity.id);
        const data = await fetchWithAuth(`/teacher/test/${activity.id}`);
        setTestDetails((prev) => ({ ...prev, [activity.id]: data }));
      } catch (err) {
        console.error("Error al cargar el test:", err);
      } finally {
        setLoadingTestId(null);
      }
    }
  };

  if (loading) return <p>Cargando actividades...</p>;

  return (
    <Card className="p-4">
      <h2>Actividades del Curso</h2>

      {activities.length === 0 ? (
        <p>No hay actividades disponibles. Crea una nueva.</p>
      ) : (
        <ListGroup variant="flush">
          {activities.map((activity) => (
            <ListGroup.Item key={activity.id}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => toggleExpand(activity)}
              >
                <strong>{activity.title}</strong>
              </div>

              <Collapse in={expandedActivityId === activity.id}>
                <div className="mt-2">
                  <p><strong>Descripción:</strong> {activity.description}</p>
                  <p><strong>Tipo:</strong> {activity.type}</p>
                  <p><strong>Fecha límite:</strong> {activity.dueDate}</p>

                  {/* Mostrar preguntas si es TEST */}
                  {activity.type === "TEST" && (
                    <>
                      {loadingTestId === activity.id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        testDetails[activity.id] && (
                          <>
                            <h6 className="mt-3">Preguntas:</h6>
                            {testDetails[activity.id].questions.map((q, i) => (
                              <div key={i} className="mb-2">
                                <strong>{q.text}</strong>
                                <ul>
                                  {q.options.map((opt, j) => (
                                    <li key={j}>
                                      {opt.text}
                                      {opt.correct && (
                                        <span style={{ color: "green" }}> ✔</span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </>
                        )
                      )}
                    </>
                  )}
                </div>
              </Collapse>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card>
  );
};

export default TeacherCourseActivities;
