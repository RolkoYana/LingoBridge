import React, { useEffect, useState } from "react";
import { Table, Badge } from "react-bootstrap";
import { 
  FaStar, 
  FaBook, 
  FaUserTie, 
  FaCalendarAlt, 
  FaCommentDots,
  FaTrophy,
  FaChartLine
} from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";
import "./StudentEvaluations.css";

const StudentEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const data = await fetchWithAuth("/student/activity-results");
        setEvaluations(data);
      } catch (error) {
        console.error("Error al cargar las evaluaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 9) return "success";
    if (score >= 7) return "warning";
    if (score >= 5) return "info";
    return "danger";
  };

  const getScoreIcon = (score) => {
    if (score >= 9) return <FaTrophy className="me-1" />;
    if (score >= 7) return <FaStar className="me-1" />;
    return <FaChartLine className="me-1" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calcular estadísticas
  const evaluatedActivities = evaluations.filter(evaluation => 
    evaluation.score !== null && evaluation.score !== undefined
  );
  
  const averageScore = evaluatedActivities.length > 0 
    ? (evaluatedActivities.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluatedActivities.length).toFixed(1)
    : 0;
  
  const excellentCount = evaluatedActivities.filter(evaluation => evaluation.score >= 9).length;
  const goodCount = evaluatedActivities.filter(evaluation => 
    evaluation.score >= 7 && evaluation.score < 9
  ).length;

  if (loading) {
    return (
      <div className="evaluations-container">
        <div className="evaluations-header">
          <h2 className="evaluations-title">Mis Evaluaciones</h2>
          <p className="evaluations-subtitle">Cargando tus evaluaciones...</p>
        </div>
        <div className="evaluations-loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="evaluations-container">
      {/* Header con estadísticas */}
      <div className="evaluations-header">
        <div className="header-main">
          <div className="header-info">
            <FaStar size={28} className="header-icon" />
            <div>
              <h2 className="evaluations-title">Mis Evaluaciones</h2>
              <p className="evaluations-subtitle">
                {evaluations.length} actividad{evaluations.length !== 1 ? 'es' : ''}
                {evaluatedActivities.length > 0 && ` • ${evaluatedActivities.length} evaluada${evaluatedActivities.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <div className="evaluation-stats">
            <div className="stat-item">
              <div className="stat-number primary">{averageScore}</div>
              <div className="stat-label">Promedio</div>
            </div>
            <div className="stat-item">
              <div className="stat-number success">{excellentCount}</div>
              <div className="stat-label">Excelentes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number warning">{goodCount}</div>
              <div className="stat-label">Buenas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="evaluations-content">
        {evaluations.length === 0 ? (
          <div className="evaluations-empty">
            <div className="empty-icon">📊</div>
            <h4 className="empty-title">No hay evaluaciones disponibles</h4>
            <p className="empty-text">
              Las evaluaciones de tus actividades aparecerán aquí una vez que los profesores las revisen.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <Table className="evaluations-table" hover>
              <thead>
                <tr>
                  <th>Actividad</th>
                  <th>Curso</th>
                  <th>Calificación</th>
                  <th>Comentarios</th>
                  <th>Fecha</th>
                  <th>Profesor</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((evalItem) => (
                  <tr 
                    key={evalItem.activityResultId} 
                    className={evalItem.score === null ? 'pending-evaluation' : ''}
                  >
                    <td>
                      <div className="activity-cell">
                        <div className="activity-title">{evalItem.activityTitle}</div>
                      </div>
                    </td>
                    
                    <td>
                      {evalItem.courseName}
                    </td>
                    
                    <td>
                      {evalItem.score !== null && evalItem.score !== undefined ? (
                        <Badge bg={getScoreColor(evalItem.score)} className="score-badge">
                          {getScoreIcon(evalItem.score)}
                          {evalItem.score}/10
                        </Badge>
                      ) : (
                        <Badge bg="secondary" className="score-badge">
                          <FaCalendarAlt className="me-1" />
                          Pendiente
                        </Badge>
                      )}
                    </td>
                    
                    <td>
                      <div className="feedback-cell">
                        {evalItem.feedback ? (
                          <div className="feedback-content">
                            <FaCommentDots size={12} className="feedback-icon" />
                            <span className="feedback-text">{evalItem.feedback}</span>
                          </div>
                        ) : (
                          <span className="no-feedback">Sin comentarios</span>
                        )}
                      </div>
                    </td>
                    
                    <td>
                      <div className="date-cell">
                        <FaCalendarAlt size={12} className="date-icon" />
                        <span className="date-text">{formatDate(evalItem.completedAt)}</span>
                      </div>
                    </td>
                    
                    <td>
                      <div className="teacher-cell">
                        <FaUserTie size={12} className="teacher-icon" />
                        <span className="teacher-name">{evalItem.teacherName}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEvaluations;