import React, { useState, useEffect } from "react";
import { Card, Collapse, Spinner, Button, Badge, Modal, Toast, ToastContainer } from "react-bootstrap";
import { 
  FaTasks, 
  FaChevronDown, 
  FaChevronUp, 
  FaEdit,
  FaQuestionCircle,
  FaFileAlt,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaClipboardList,
  FaTrash,
  FaClock,
  FaGraduationCap,
  FaCheckCircle,
  FaTimes
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [deletingActivityId, setDeletingActivityId] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Función para mostrar notificaciones
  const showNotification = (type, title, message) => {
    const id = Date.now();
    const notification = { id, type, title, message };
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Función para cerrar notificación manualmente
  const closeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
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

  // Abrir modal de confirmación de eliminación
  const handleDeleteClick = (activity) => {
    setActivityToDelete(activity);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!activityToDelete) return;

    try {
      setDeletingActivityId(activityToDelete.id);
      
      await fetchWithAuth(`/teacher/activity/${activityToDelete.id}`, {
        method: "DELETE",
      });

      // Actualizar la lista de actividades
      setActivities(prevActivities => 
        prevActivities.filter(activity => activity.id !== activityToDelete.id)
      );

      // Limpiar detalles del test si existían
      if (activityToDelete.type === "TEST") {
        setTestDetails(prev => {
          const newDetails = { ...prev };
          delete newDetails[activityToDelete.id];
          return newDetails;
        });
      }

      // Cerrar expandido si era el que se eliminó
      if (expandedActivityId === activityToDelete.id) {
        setExpandedActivityId(null);
      }

      showNotification('success', '¡Actividad eliminada!', `La actividad "${activityToDelete.title}" ha sido eliminada correctamente.`);
      setShowDeleteModal(false);
      setActivityToDelete(null);
      
    } catch (error) {
      console.error("Error eliminando actividad:", error);
      
      if (error.message.includes("401")) {
        showNotification('error', 'Sesión expirada', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else if (error.message.includes("404")) {
        showNotification('error', 'Error de permisos', 'La actividad no existe o no tienes permisos para eliminarla.');
      } else {
        showNotification('error', 'Error al eliminar', `No se pudo eliminar la actividad: ${error.message}`);
      }
    } finally {
      setDeletingActivityId(null);
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setActivityToDelete(null);
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
      
      showNotification('success', '¡Actividad actualizada!', 'Los cambios se han guardado correctamente.');
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
        showNotification('error', 'Sesión expirada', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else if (error.message.includes("constraint")) {
        showNotification('error', 'Error de base de datos', 'Error en la base de datos. Contacta al administrador del sistema.');
      } else {
        showNotification('error', 'Error al guardar', `No se pudieron guardar los cambios: ${error.message}`);
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
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateStatus = (dueDate) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return { status: 'overdue', text: 'Vencida', color: 'danger' };
    if (days === 0) return { status: 'today', text: 'Hoy', color: 'warning' };
    if (days <= 3) return { status: 'soon', text: `${days} días`, color: 'warning' };
    if (days <= 7) return { status: 'week', text: `${days} días`, color: 'info' };
    return { status: 'future', text: `${days} días`, color: 'success' };
  };

  if (loading) {
    return (
      <div className="activities-loading">
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
        </div>
        <p className="loading-text">Cargando actividades...</p>
      </div>
    );
  }

  return (
    <div className="teacher-course-activities">
      <div className="activities-container">
        {/* Header mejorado */}
        <div className="activities-header-modern">
          <div className="header-content-modern">
            <div className="header-icon-modern">
              <FaTasks />
            </div>
            <div className="header-text-modern">
              <h2 className="header-title-modern">Actividades del Curso</h2>
              <p className="header-subtitle-modern">
                Gestiona y organiza las actividades de tu curso
              </p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{activities.length}</span>
              <span className="stat-label">
                {activities.length === 1 ? 'Actividad' : 'Actividades'}
              </span>
            </div>
          </div>
        </div>

        {/* Lista de actividades */}
        {activities.length === 0 ? (
          <div className="no-activities-modern">
            <div className="no-activities-icon-modern">
              <FaGraduationCap />
            </div>
            <h3>No hay actividades creadas</h3>
            <p>Comienza creando tu primera actividad para este curso</p>
          </div>
        ) : (
          <div className="activities-grid">
            {activities.map((activity, index) => {
              const dueDateInfo = getDueDateStatus(activity.dueDate);
              const isExpanded = expandedActivityId === activity.id;
              
              return (
                <div 
                  key={activity.id} 
                  className={`activity-card-modern ${isExpanded ? 'expanded' : ''}`}
                  style={{ '--delay': `${index * 0.1}s` }}
                >
                  {/* Header de la tarjeta */}
                  <div className="activity-card-header">
                    <div className="activity-type-icon">
                      {activity.type === "TEST" ? (
                        <FaQuestionCircle className="test-icon" />
                      ) : (
                        <FaFileAlt className="task-icon" />
                      )}
                    </div>
                    
                    <div className="activity-main-content">
                      <div className="activity-title-row">
                        <h3 className="activity-title-modern">{activity.title}</h3>
                        <Badge 
                          bg={activity.type === "TEST" ? "danger" : "primary"} 
                          className="activity-type-badge-modern"
                        >
                          {activityTypeLabels[activity.type]}
                        </Badge>
                      </div>
                      
                      <div className="activity-meta-row">
                        <div className="due-date-info">
                          <FaCalendarAlt className="date-icon" />
                          <span className="date-text">{formatDate(activity.dueDate)}</span>
                          <Badge bg={dueDateInfo.color} className="due-status-badge">
                            <FaClock className="me-1" />
                            {dueDateInfo.text}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="activity-actions-modern">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="action-btn edit-btn-modern"
                      onClick={() => handleEditClick(activity)}
                    >
                      <FaEdit />
                      <span>Editar</span>
                    </Button>
                    
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="action-btn delete-btn-modern"
                      onClick={() => handleDeleteClick(activity)}
                      disabled={deletingActivityId === activity.id}
                    >
                      {deletingActivityId === activity.id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <FaTrash />
                      )}
                      <span>
                        {deletingActivityId === activity.id ? 'Eliminando...' : 'Eliminar'}
                      </span>
                    </Button>
                    
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="action-btn expand-btn-modern"
                      onClick={() => toggleExpand(activity)}
                    >
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      <span>{isExpanded ? 'Ocultar' : 'Ver más'}</span>
                    </Button>
                  </div>

                  {/* Contenido expandible */}
                  <Collapse in={isExpanded}>
                    <div className="activity-details-modern">
                      <div className="description-section">
                        <h4>Descripción</h4>
                        <p>{activity.description}</p>
                      </div>

                      {activity.type === "TEST" && (
                        <div className="test-details-modern">
                          {loadingTestId === activity.id ? (
                            <div className="test-loading-modern">
                              <Spinner animation="border" size="sm" />
                              <span>Cargando preguntas del test...</span>
                            </div>
                          ) : (
                            testDetails[activity.id] && (
                              <div className="questions-section">
                                <h4>
                                  Preguntas del Test 
                                  <Badge bg="info" className="ms-2">
                                    {testDetails[activity.id].questions.length} preguntas
                                  </Badge>
                                </h4>
                                <div className="questions-grid">
                                  {testDetails[activity.id].questions.map((question, qIndex) => (
                                    <div key={qIndex} className="question-card-modern">
                                      <div className="question-header-modern">
                                        <span className="question-number">#{qIndex + 1}</span>
                                        <span className="question-text">{question.text}</span>
                                      </div>
                                      <div className="options-grid">
                                        {question.options.map((option, oIndex) => (
                                          <div 
                                            key={oIndex} 
                                            className={`option-modern ${option.correct ? 'correct' : ''}`}
                                          >
                                            <span className="option-letter">
                                              {String.fromCharCode(65 + oIndex)}
                                            </span>
                                            <span className="option-text">{option.text}</span>
                                            {option.correct && (
                                              <span className="correct-indicator">✓</span>
                                            )}
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
                        <div className="task-info-modern">
                          <div className="task-note-modern">
                            <FaFileAlt className="task-note-icon" />
                            <span>Esta es una actividad de ejercicio escrito que los estudiantes deberán completar y entregar.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Collapse>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para editar actividad */}
      <Modal
        show={showEditModal}
        onHide={handleCancelEdit}
        size="lg"
        centered
        className="edit-activity-modal-modern"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" />
            Editar {currentActivity?.type === "TEST" ? "Test" : "Ejercicio"}
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

      {/* Modal de confirmación para eliminar actividad */}
      <Modal
        show={showDeleteModal}
        onHide={handleCancelDelete}
        centered
        className="delete-activity-modal-modern"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaExclamationTriangle className="me-2 text-danger" />
            Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="delete-confirmation-modern">
            <div className="delete-icon-modern">
              <FaTrash />
            </div>
            <h4>¿Eliminar actividad?</h4>
            <p>
              Estás a punto de eliminar la actividad <strong>"{activityToDelete?.title}"</strong>
            </p>
            <div className="warning-box-modern">
              <FaExclamationTriangle />
              <div>
                <strong>Esta acción no se puede deshacer</strong>
                {activityToDelete?.type === "TEST" && (
                  <span> y se eliminarán también todas las preguntas asociadas.</span>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
            disabled={deletingActivityId === activityToDelete?.id}
          >
            {deletingActivityId === activityToDelete?.id ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Eliminando...
              </>
            ) : (
              <>
                <FaTrash className="me-2" />
                Eliminar Actividad
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sistema de notificaciones modernas */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-toast ${notification.type}`}
          >
            <div className="notification-icon">
              {notification.type === 'success' ? (
                <FaCheckCircle />
              ) : notification.type === 'error' ? (
                <FaExclamationTriangle />
              ) : (
                <FaExclamationTriangle />
              )}
            </div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
            </div>
            <button
              className="notification-close"
              onClick={() => closeNotification(notification.id)}
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCourseActivities;