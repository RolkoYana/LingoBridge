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
  FaFileAlt,
} from "react-icons/fa";
import { fetchWithAuth } from "../../../api/api";
import "./StudentCourseActivities.css";

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

        const data = await fetchWithAuth(`/student/course/${courseId}/activity`);

        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          setActivities([]);
        }
      } catch (error) {
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

    if (activity.type === "TASK") {
      navigate(`/student/course/${courseId}/task/${activity.id}`);
    } else if (activity.type === "TEST") {
      navigate(`/student/course/${courseId}/test/${activity.id}`);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "TASK":
        return FaFileAlt;
      case "TEST":
        return FaClipboardCheck;
      default:
        return FaTasks;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "TASK":
        return "primary";
      case "TEST":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getActivityTypeName = (type) => {
    switch (type) {
      case "TASK":
        return "Tarea";
      case "TEST":
        return "Test";
      default:
        return "Actividad";
    }
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;

    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: "overdue", text: "Vencida", color: "danger", icon: FaExclamationTriangle };
    } else if (diffDays === 0) {
      return { status: "today", text: "Vence hoy", color: "warning", icon: FaExclamationTriangle };
    } else if (diffDays <= 3) {
      return { status: "urgent", text: `${diffDays} día${diffDays > 1 ? "s" : ""}`, color: "warning", icon: FaClock };
    } else {
      return { status: "normal", text: `${diffDays} días`, color: "success", icon: FaCalendarAlt };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="activities-loading">
        <Spinner animation="border" variant="primary" />
        <p>Cargando actividades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activities-container">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="activities-container">
        <div className="activities-empty">
          <h5>📋 No hay actividades disponibles</h5>
          <p>El profesor aún no ha creado actividades para este curso.</p>
        </div>
      </div>
    );
  }

  const pendingActivities = activities.filter((a) => !a.completed);
  const completedActivities = activities.filter((a) => a.completed);

  return (
    <div className="activities-container">
      {/* Actividades pendientes */}
      {pendingActivities.length > 0 && (
        <div className="activities-section">
          <h5 className="section-title">
            <FaClock className="section-icon" />
            Actividades Pendientes
            <Badge bg="warning">{pendingActivities.length}</Badge>
          </h5>
          
          <div className="activities-list">
            {pendingActivities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              const dueDateStatus = getDueDateStatus(activity.dueDate);

              return (
                <div 
                  key={activity.id} 
                  className={`activity-item pending-item ${dueDateStatus?.status || ''}`}
                  onClick={() => handleClick(activity)}
                >
                  <div className="activity-icon">
                    <ActivityIcon />
                  </div>
                  
                  <div className="activity-content">
                    <div className="activity-main">
                      <h6 className="activity-title">{activity.title}</h6>
                      <p className="activity-description">
                        {activity.description || "Sin descripción disponible"}
                      </p>
                      {activity.dueDate && (
                        <small className="activity-date">
                          📅 Fecha límite: {formatDate(activity.dueDate)}
                        </small>
                      )}
                    </div>
                    
                    <div className="activity-meta">
                      <Badge bg={getActivityColor(activity.type)} className="activity-type">
                        {getActivityTypeName(activity.type)}
                      </Badge>
                      
                      {dueDateStatus && (
                        <Badge bg={dueDateStatus.color} className={`due-status ${dueDateStatus.status}`}>
                          <dueDateStatus.icon className="me-1" />
                          {dueDateStatus.text}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="activity-action">
                    <span>Realizar actividad</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actividades completadas */}
      {completedActivities.length > 0 && (
        <div className="activities-section">
          <h5 className="section-title">
            <FaCheckCircle className="section-icon" />
            Actividades Completadas
            <Badge bg="success">{completedActivities.length}</Badge>
          </h5>
          
          <div className="activities-list">
            {completedActivities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);

              return (
                <div key={activity.id} className="activity-item completed-item">
                  <div className="activity-icon completed-icon">
                    <ActivityIcon />
                  </div>
                  
                  <div className="activity-content">
                    <div className="activity-main">
                      <h6 className="activity-title">{activity.title}</h6>
                      <p className="activity-description">
                        {activity.description || "Sin descripción disponible"}
                      </p>
                      <div className="activity-dates">
                        {activity.dueDate && (
                          <small className="activity-date">
                            📅 Fecha límite: {formatDate(activity.dueDate)}
                          </small>
                        )}
                        {activity.completedDate && (
                          <small className="activity-completed">
                            ✅ Completada: {formatDate(activity.completedDate)}
                          </small>
                        )}
                      </div>
                    </div>
                    
                    <div className="activity-meta">
                      <Badge bg="success" className="activity-status">
                        <FaCheckCircle className="me-1" />
                        Completada
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourseActivities;