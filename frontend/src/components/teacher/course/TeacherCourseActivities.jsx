import React, { useState, useEffect } from "react";
import { Card, ListGroup, Collapse, Spinner, Button, Form, Row, Col } from "react-bootstrap";
import { fetchWithAuth } from "../../../api/api";
import EditActivityForm from "../../forms/EditActivityForm";

// Labels para tipo de actividad
const activityTypeLabels = {
  TEST: "Test",
  TASK: "Ejercicio escrito",
};

const TeacherCourseActivities = ({ courseId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedActivityId, setExpandedActivityId] = useState(null);
  const [testDetails, setTestDetails] = useState({});
  const [loadingTestId, setLoadingTestId] = useState(null);

  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [currentActivity, setCurrentActivity] = useState(null); // ← AGREGAR ESTO

  // Cargar todas las actividades
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth(`/teacher/course/${courseId}/activity`);
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

  // Cargar detalles TEST
  const fetchTestDetails = async (activityId) => {
    try {
      setLoadingTestId(activityId);
      const data = await fetchWithAuth(`/teacher/test/${activityId}`);
      setTestDetails((prev) => ({ ...prev, [activityId]: data }));
      return data;
    } catch (error) {
      console.error("Error cargando test:", error);
      return null;
    } finally {
      setLoadingTestId(null);
    }
  };

  // Expandir actividad y cargar detalles si es TEST
  const toggleExpand = async (activity) => {
    const isOpen = expandedActivityId === activity.id;
    setExpandedActivityId(isOpen ? null : activity.id);

    if (!isOpen && activity.type === "TEST" && !testDetails[activity.id]) {
      await fetchTestDetails(activity.id);
    }
  };

  // Abrir edición
  const handleEditClick = async (activity) => {
    setEditingActivityId(activity.id);
    setCurrentActivity(activity); // ← GUARDAR LA ACTIVIDAD ACTUAL

    if (activity.type === "TEST") {
      let data = testDetails[activity.id];
      if (!data) {
        data = await fetchTestDetails(activity.id);
      }
      setEditData(data);
    } else {
      setEditData(activity);
    }
    // Asegurar que se expanda para ver el formulario
    setExpandedActivityId(activity.id);
  };

  // Guardar cambios usando EditActivityForm
  const handleSaveFromForm = async (updatedData) => {
    try {
      if (currentActivity.type === "TEST") {
        // PUT test - Enviar estructura más completa
        const payload = {
          title: updatedData.title,
          description: updatedData.description,
          dueDate: updatedData.dueDate,
          questions: updatedData.questions?.map((q, qIndex) => ({
            id: q.id || null, // Mantener ID si existe
            text: q.text,
            options: q.options?.map((opt, oIndex) => ({
              id: opt.id || null, // Mantener ID si existe
              text: opt.text,
              correct: opt.correct
            })) || []
          })) || []
        };

        console.log("Enviando payload:", payload); // Para debug

        await fetchWithAuth(`/teacher/test/${editingActivityId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // PUT actividad normal
        await fetchWithAuth(`/teacher/activity/${editingActivityId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: updatedData.title,
            description: updatedData.description,
            dueDate: updatedData.dueDate,
          }),
        });
      }
      alert("Actividad actualizada correctamente");
      setEditingActivityId(null);
      setEditData(null);
      setCurrentActivity(null);
      
      // Actualizar el cache de testDetails
      if (currentActivity.type === "TEST") {
        setTestDetails(prev => ({ ...prev, [editingActivityId]: updatedData }));
      }
      
      fetchActivities();
    } catch (error) {
      console.error("Error guardando cambios:", error);
      console.error("Error details:", error.message);
      
      // Mostrar mensaje más específico
      if (error.message.includes("401")) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else if (error.message.includes("constraint")) {
        alert("Error en la base de datos. Contacta al administrador del sistema.");
      } else {
        alert(`Error guardando cambios: ${error.message}`);
      }
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingActivityId(null);
    setEditData(null);
    setCurrentActivity(null);
  };

  return (
    <Card className="p-4">
      <h2>Actividades del Curso</h2>

      {loading ? (
        <p>Cargando actividades...</p>
      ) : activities.length === 0 ? (
        <p>No hay actividades disponibles. Crea una nueva.</p>
      ) : (
        <ListGroup variant="flush">
          {activities.map((activity) => (
            <ListGroup.Item key={activity.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => toggleExpand(activity)}
              >
                <strong>{activity.title}</strong>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(activity);
                  }}
                >
                  Editar
                </Button>
              </div>

              <Collapse in={expandedActivityId === activity.id}>
                <div className="mt-2">
                  {editingActivityId === activity.id && editData && currentActivity ? (
                    // ← USAR EL COMPONENTE EditActivityForm
                    <EditActivityForm
                      activity={currentActivity}
                      formData={editData}
                      onSave={handleSaveFromForm}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <>
                      <p>
                        <strong>Descripción:</strong> {activity.description}
                      </p>
                      <p>
                        <strong>Tipo:</strong>{" "}
                        {activityTypeLabels[activity.type] || activity.type}
                      </p>
                      <p>
                        <strong>Fecha límite:</strong> {activity.dueDate}
                      </p>

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

                      {activity.type !== "TEST" && (
                        <p className="text-muted">
                          Esta actividad es de tipo escritura o tarea práctica. Aún no
                          tiene visualización detallada.
                        </p>
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