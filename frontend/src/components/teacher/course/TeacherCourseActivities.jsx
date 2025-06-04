import React, { useState, useEffect } from "react";
import { Card, Collapse, Spinner, Button, Badge, Modal } from "react-bootstrap";
import { 
  FaTasks, 
  FaChevronDown, 
  FaChevronUp, 
  FaEdit,
  FaQuestionCircle,
  FaFileAlt,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaClipboardList
} from "react-icons/fa";
import { fetchWithAuth } from "../../../api/api";
import EditActivityForm from "../../forms/EditActivityForm";
import "./TeacherCourseActivities.css";

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
  const [currentActivity, setCurrentActivity] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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
    setCurrentActivity(activity);

    if (activity.type === "TEST") {
      let data = testDetails[activity.id];
      if (!data) {
        data = await fetchTestDetails(activity.id);
      }
      setEditData(data);
    } else {
      setEditData(activity);
    }
    setShowEditModal(true);
  };

  // Guardar cambios usando EditActivityForm
  const handleSaveFromForm = async (updatedData) => {
    try {
      if (currentActivity.type === "TEST") {
        const payload = {
          title: updatedData.title,
          description: updatedData.description,
          dueDate: updatedData.dueDate,
          questions: updatedData.questions?.map((q, qIndex) => ({
            id: q.id || null,
            text: q.text,
            options: q.options?.map((opt, oIndex) => ({
              id: opt.id || null,
              text: opt.text,
              correct: opt.correct
            })) || []
          })) || []
        };

        await fetchWithAuth(`/teacher/test/${editingActivityId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
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
      setShowEditModal(false);
      setEditingActivityId(null);
      setEditData(null);
      setCurrentActivity(null);
      
      if (currentActivity.type === "TEST") {
        setTestDetails(prev => ({ ...prev, [editingActivityId]: updatedData }));
      }
      
      fetchActivities();
    } catch (error) {
      console.error("Error guardando cambios:", error);
      
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
    setShowEditModal(false);
    setEditingActivityId(null);
    setEditData(null);
    setCurrentActivity(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="activities-loading">
        <Spinner animation="border" variant="primary" />
        <p>Cargando actividades...</p>
      </div>
    );
  }

  return (
    <div className="teacher-course-activities">
      <Card className="activities-card">
        <Card.Header className="activities-header">
          <div className="header-content">
            <FaTasks className="header-icon" />
            <div>
              <h4 className="header-title">Actividades del Curso</h4>
              <p className="header-subtitle">
                {activities.length} actividad{activities.length !== 1 ? 'es' : ''} creada{activities.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {activities.length > 0 && (
            <Badge bg="warning" className="activities-count">
              {activities.length}
            </Badge>
          )}
        </Card.Header>

        <Card.Body className="activities-body">
          {activities.length === 0 ? (
            <div className="no-activities">
              <FaClipboardList className="no-activities-icon" />
              <h5>No hay actividades disponibles</h5>
              <p>Aún no se han creado actividades para este curso.</p>
            </div>
          ) : (
            <div className="activities-list">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div 
                    className="activity-header"
                    onClick={() => toggleExpand(activity)}
                  >
                    <div className="activity-main-info">
                      <div className="activity-icon">
                        {activity.type === "TEST" ? <FaQuestionCircle /> : <FaFileAlt />}
                      </div>
                      <div className="activity-details">
                        <div className="activity-title-section">
                          <h5 className="activity-title">{activity.title}</h5>
                        </div>
                        <div className="activity-info-section">
                          <Badge 
                            bg={activity.type === "TEST" ? "danger" : "primary"} 
                            className="activity-type-badge"
                          >
                            {activityTypeLabels[activity.type] || activity.type}
                          </Badge>
                          <span className="activity-date">
                            <FaCalendarAlt className="me-1" />
                            {formatDate(activity.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="activity-actions">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(activity);
                        }}
                      >
                        <FaEdit className="me-1" />
                        Editar
                      </Button>
                      <div className="expand-icon">
                        {expandedActivityId === activity.id ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </div>
                  </div>

                  <Collapse in={expandedActivityId === activity.id}>
                    <div className="activity-content">
                      <div className="activity-info">
                        <div className="info-section">
                          <h6>Descripción</h6>
                          <p>{activity.description}</p>
                        </div>

                        {activity.type === "TEST" && (
                          <div className="test-details">
                            {loadingTestId === activity.id ? (
                              <div className="test-loading">
                                <Spinner animation="border" size="sm" />
                                <span>Cargando preguntas...</span>
                              </div>
                            ) : (
                              testDetails[activity.id] && (
                                <div className="info-section">
                                  <h6>Preguntas del Test ({testDetails[activity.id].questions.length})</h6>
                                  <div className="questions-list">
                                    {testDetails[activity.id].questions.map((q, i) => (
                                      <div key={i} className="question-item">
                                        <div className="question-header">
                                          <strong>Pregunta {i + 1}:</strong> {q.text}
                                        </div>
                                        <div className="options-list">
                                          {q.options.map((opt, j) => (
                                            <div 
                                              key={j} 
                                              className={`option-item ${opt.correct ? 'correct' : ''}`}
                                            >
                                              <span className="option-letter">
                                                {String.fromCharCode(65 + j)}
                                              </span>
                                              {opt.text}
                                              {opt.correct && <span className="correct-indicator">✓</span>}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {activity.type !== "TEST" && (
                          <div className="info-section">
                            <p className="task-note">
                              Esta actividad es de tipo escritura o tarea práctica.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Collapse>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal para editar actividad */}
      <Modal
        show={showEditModal}
        onHide={handleCancelEdit}
        size="lg"
        centered
        className="edit-activity-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" />
            Editar {currentActivity?.type === "TEST" ? "Test" : "Tarea"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editData && currentActivity && (
            <EditActivityForm
              activity={currentActivity}
              formData={editData}
              onSave={handleSaveFromForm}
              onCancel={handleCancelEdit}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TeacherCourseActivities;