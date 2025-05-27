import React, { useEffect, useState } from "react";
import { Table, Row, Col, Badge } from "react-bootstrap";
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

const StudentEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
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
    if (score >= 5) return <FaChartLine className="me-1" />;
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
  const evaluatedActivities = evaluations.filter(evaluation => evaluation.score !== null && evaluation.score !== undefined);
  const averageScore = evaluatedActivities.length > 0 
    ? (evaluatedActivities.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluatedActivities.length).toFixed(1)
    : 0;
  
  const excellentCount = evaluatedActivities.filter(evaluation => evaluation.score >= 9).length;
  const goodCount = evaluatedActivities.filter(evaluation => evaluation.score >= 7 && evaluation.score < 9).length;

  if (loading) {
    return (
      <div className="unified-section">
        <div className="section-header">
          <div className="d-flex align-items-center">
            <FaStar size={28} className="header-icon me-3" />
            <div>
              <h2 className="section-title">Mis Evaluaciones</h2>
              <p className="section-subtitle">Cargando tus evaluaciones...</p>
            </div>
          </div>
        </div>
        <div className="section-content">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="unified-section">
      {/* Header integrado */}
      <div className="section-header">
        <Row className="align-items-center">
          <Col>
            <div className="d-flex align-items-center">
              <FaStar size={28} className="header-icon me-3" />
              <div>
                <h2 className="section-title">Mis Evaluaciones</h2>
                <p className="section-subtitle">
                  {evaluations.length} actividad{evaluations.length !== 1 ? 'es' : ''} 
                  {evaluatedActivities.length > 0 && ` • ${evaluatedActivities.length} evaluada${evaluatedActivities.length !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </Col>
          <Col xs="auto">
            <div className="evaluation-stats-header d-flex gap-4">
              <div className="evaluation-stat-item">
                <div className="stat-number text-primary">{averageScore}</div>
                <div className="stat-label">Promedio</div>
              </div>
              <div className="evaluation-stat-item">
                <div className="stat-number text-success">{excellentCount}</div>
                <div className="stat-label">Excelentes</div>
              </div>
              <div className="evaluation-stat-item">
                <div className="stat-number text-warning">{goodCount}</div>
                <div className="stat-label">Buenas</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Contenido principal */}
      <div className="section-content">
        {evaluations.length === 0 ? (
          <div className="empty-section">
            <FaStar size={64} className="empty-icon" />
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
                  <th className="text-center">Calificación</th>
                  <th>Comentarios</th>
                  <th>Fecha</th>
                  <th>Profesor</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((evalItem) => (
                  <tr key={evalItem.activityResultId} className={evalItem.score === null ? 'pending-evaluation' : ''}>
                    <td>
                      <div className="activity-cell">
                        <div className="activity-title">{evalItem.activityTitle}</div>
                      </div>
                    </td>
                    <td>
                      <div className="course-cell">
                        <FaBook size={12} className="me-1 text-muted" />
                        <span className="course-name">{evalItem.courseName}</span>
                      </div>
                    </td>
                    <td className="text-center">
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
                            <FaCommentDots size={12} className="me-1 text-muted" />
                            <span className="feedback-text">{evalItem.feedback}</span>
                          </div>
                        ) : (
                          <span className="no-feedback">Sin comentarios</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        <FaCalendarAlt size={12} className="me-1 text-muted" />
                        <span className="date-text">{formatDate(evalItem.completedAt)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="teacher-cell">
                        <FaUserTie size={12} className="me-1 text-muted" />
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