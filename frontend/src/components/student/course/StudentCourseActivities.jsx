import React, { useEffect, useState } from "react";
import { Spinner, Alert, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  FaTasks, 
  FaClipboardCheck, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaInfoCircle,
  FaArrowRight,
  FaHourglassHalf,
  FaFlag
} from "react-icons/fa";
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

    if (courseId) {
      loadActivities();
    }
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
      navigate(`/student/course/${courseId}/task/${activity.id}`);
    } else if (activity.type === "TEST") {
      navigate(`/student/course/${courseId}/test/${activity.id}`);
    } else {
      console.warn("Tipo de actividad desconocido:", activity);
    }
  };

  // Función para obtener el icono según el tipo de actividad
  const getActivityIcon = (type) => {
    switch (type) {
      case 'TASK':
        return FaTasks;
      case 'TEST':
        return FaClipboardCheck;
      default:
        return FaInfoCircle;
    }
  };

  // Función para obtener el color del badge según el tipo
  const getActivityColor = (type) => {
    switch (type) {
      case 'TASK':
        return 'primary';
      case 'TEST':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Función para obtener el nombre legible del tipo
  const getActivityTypeName = (type) => {
    switch (type) {
      case 'TASK':
        return 'Tarea';
      case 'TEST':
        return 'Evaluación';
      default:
        return 'Actividad';
    }
  };

  // Función para obtener el estado de la fecha límite
  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;
    
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        status: 'overdue', 
        text: 'Vencida', 
        color: 'danger', 
        icon: FaExclamationTriangle,
        priority: 3
      };
    } else if (diffDays === 0) {
      return { 
        status: 'today', 
        text: 'Vence hoy', 
        color: 'warning', 
        icon: FaFlag,
        priority: 2
      };
    } else if (diffDays <= 3) {
      return { 
        status: 'urgent', 
        text: `${diffDays} día${diffDays > 1 ? 's' : ''}`, 
        color: 'warning', 
        icon: FaHourglassHalf,
        priority: 1
      };
    } else {
      return { 
        status: 'normal', 
        text: `${diffDays} días`, 
        color: 'success', 
        icon: FaCalendarAlt,
        priority: 0
      };
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="activities-loading">
        <Spinner animation="border" variant="primary" size="sm" />
        <span>Cargando actividades...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activities-error">
        <FaInfoCircle />
        <span>{error}</span>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="activities-empty">
        <div className="empty-icon">
          <FaTasks size={48} />
        </div>
        <h6 className="empty-title">No hay actividades disponibles</h6>
        <p className="empty-text">
          El profesor aún no ha creado actividades para este curso.
          Te notificaremos cuando haya nuevas tareas o evaluaciones.
        </p>
      </div>
    );
  }

  // Separar actividades por estado y ordenar por prioridad
  const pendingActivities = activities
    .filter(a => !a.completed)
    .sort((a, b) => {
      const statusA = getDueDateStatus(a.dueDate);
      const statusB = getDueDateStatus(b.dueDate);
      const priorityA = statusA?.priority || 0;
      const priorityB = statusB?.priority || 0;
      return priorityB - priorityA; // Mayor prioridad primero
    });
    
  const completedActivities = activities.filter(a => a.completed);

  return (
    <div className="activities-container">
      {/* Estadísticas de actividades */}
      <div className="activities-stats">
        <div className="stat-item">
          <span className="stat-number">{activities.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{pendingActivities.length}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{completedActivities.length}</span>
          <span className="stat-label">Completadas</span>
        </div>
      </div>

      {/* Actividades pendientes */}
      {pendingActivities.length > 0 && (
        <div className="activities-section">
          <div className="section-title">
            <FaClock className="section-icon pending-icon" />
            <h6>Actividades Pendientes</h6>
          </div>
          <div className="activities-list">
            {pendingActivities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              const dueDateStatus = getDueDateStatus(activity.dueDate);
              
              return (
                <div
                  key={activity.id}
                  className={`activity-item pending ${dueDateStatus?.status || ''}`}
                  onClick={() => handleClick(activity)}
                >
                  <div className="activity-content">
                    <div className="activity-header">
                      <div className="activity-main-info">
                        <div className="activity-icon-wrapper">
                          <ActivityIcon className="activity-icon" />
                        </div>
                        <div className="activity-details">
                          <h6 className="activity-title">{activity.title}</h6>
                          <p className="activity-description">
                            {activity.description || "Sin descripción disponible"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="activity-meta">
                        <Badge 
                          bg={getActivityColor(activity.type)} 
                          className="activity-badge"
                        >
                          <ActivityIcon className="me-1" />
                          {getActivityTypeName(activity.type)}
                        </Badge>
                        
                        {dueDateStatus && (
                          <Badge 
                            bg={dueDateStatus.color} 
                            className="due-badge"
                          >
                            <dueDateStatus.icon className="me-1" />
                            {dueDateStatus.text}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="activity-footer">
                      <div className="activity-info">
                        <span className="activity-id">
                          <FaInfoCircle className="me-1" />
                          ID: {activity.id}
                        </span>
                        {activity.dueDate && (
                          <span className="activity-due">
                            <FaCalendarAlt className="me-1" />
                            Fecha límite: {formatDate(activity.dueDate)}
                          </span>
                        )}
                      </div>
                      
                      <div className="activity-action">
                        <span className="action-text">Realizar actividad</span>
                        <FaArrowRight className="action-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actividades completadas */}
      {completedActivities.length > 0 && (
        <div className="activities-section completed-section">
          <div className="section-title">
            <FaCheckCircle className="section-icon completed-icon" />
            <h6>Actividades Completadas</h6>
          </div>
          <div className="activities-list">
            {completedActivities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              
              return (
                <div
                  key={activity.id}
                  className="activity-item completed"
                >
                  <div className="activity-content">
                    <div className="activity-header">
                      <div className="activity-main-info">
                        <div className="activity-icon-wrapper completed">
                          <ActivityIcon className="activity-icon" />
                        </div>
                        <div className="activity-details">
                          <h6 className="activity-title">{activity.title}</h6>
                          <p className="activity-description">
                            {activity.description || "Sin descripción disponible"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="activity-meta">
                        <Badge 
                          bg="success" 
                          className="activity-badge"
                        >
                          <FaCheckCircle className="me-1" />
                          Completada
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="activity-footer">
                      <div className="activity-info">
                        <span className="activity-id">
                          <FaInfoCircle className="me-1" />
                          ID: {activity.id}
                        </span>
                        {activity.dueDate && (
                          <span className="activity-due">
                            <FaCalendarAlt className="me-1" />
                            Fecha límite: {formatDate(activity.dueDate)}
                          </span>
                        )}
                        {activity.completedDate && (
                          <span className="activity-completed">
                            <FaCheckCircle className="me-1" />
                            Completada: {formatDate(activity.completedDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Información adicional */}
      {activities.length > 0 && (
        <div className="activities-footer">
          <div className="footer-info">
            <FaInfoCircle className="info-icon" />
            <span>
              Las actividades vencidas aparecen primero. Haz clic en cualquier actividad pendiente para realizarla.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourseActivities;