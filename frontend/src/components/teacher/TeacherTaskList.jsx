import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form, Card, Badge, Row, Col } from "react-bootstrap";
import { 
  FaTasks, 
  FaEye, 
  FaCheck, 
  FaClock, 
  FaDownload,
  FaStar,
  FaUser
} from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";

const TeacherTaskList = ({ teacherUsername }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    fetchResults();
  }, [teacherUsername]);

  const fetchResults = async () => {
    try {
      const data = await fetchWithAuth(`/teacher/activity-results`);
      console.log("Datos recibidos:", data);
      setResults(data);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
      setError("No se pudieron cargar las tareas entregadas.");
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateClick = (result) => {
    setSelectedResult(result);
    setFeedback(result.feedback || "");
    setScore(result.score !== null && result.score !== undefined ? result.score : "");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!selectedResult) return;

    try {
      await fetchWithAuth(
        `/teacher/activity/${selectedResult.activityId}/evaluate?username=${encodeURIComponent(
          selectedResult.studentUsername
        )}`,
        {
          method: "POST",
          body: JSON.stringify({
            feedback,
            score: parseFloat(score),
            autoCorrected: false,
            completed: true,
            completedAt: new Date().toISOString().split("T")[0],
          }),
        }
      );

      setShowModal(false);
      fetchResults(); // recarga la lista
    } catch (err) {
      console.error("Error al enviar evaluación:", err);
      alert("❌ No se pudo guardar la evaluación.");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 9) return "success";
    if (score >= 7) return "warning";
    if (score >= 5) return "info";
    return "danger";
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
      <Card className="content-card p-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando tareas entregadas...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="content-card p-4">
        <div className="text-center text-danger">
          <FaTasks size={48} className="mb-3" />
          <h5>Error al cargar</h5>
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  const pendingTasks = results.filter(r => r.score === null || r.score === undefined);
  const evaluatedTasks = results.filter(r => r.score !== null && r.score !== undefined);

  return (
    <Card className="content-card p-4">
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <FaTasks size={24} className="text-primary me-3" />
            <div>
              <h3 className="mb-1">Tareas Entregadas</h3>
              <p className="text-muted mb-0">
                {pendingTasks.length} pendientes • {evaluatedTasks.length} evaluadas
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {results.length > 0 ? (
        <>
          {/* Tareas pendientes */}
          {pendingTasks.length > 0 && (
            <div className="mb-4">
              <h5 className="d-flex align-items-center mb-3">
                <FaClock className="text-warning me-2" />
                Pendientes de evaluar ({pendingTasks.length})
              </h5>
              <div className="tasks-grid">
                <Row>
                  {pendingTasks.map((result) => (
                    <Col md={6} lg={4} key={result.activityResultId} className="mb-3">
                      <div className="task-card pending">
                        <div className="task-header">
                          <h6 className="task-title">{result.activityTitle}</h6>
                          <Badge bg="warning" className="status-badge">
                            Pendiente
                          </Badge>
                        </div>
                        <div className="task-info">
                          <div className="student-info">
                            <FaUser size={12} className="me-1" />
                            {result.studentName}
                          </div>
                          <div className="submit-date">
                            Entregado: {formatDate(result.submittedAt)}
                          </div>
                        </div>
                        <div className="task-actions">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleEvaluateClick(result)}
                            className="w-100"
                          >
                            <FaEye className="me-1" />
                            Evaluar
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          )}

          {/* Tareas evaluadas */}
          {evaluatedTasks.length > 0 && (
            <div>
              <h5 className="d-flex align-items-center mb-3">
                <FaCheck className="text-success me-2" />
                Evaluadas ({evaluatedTasks.length})
              </h5>
              <Table className="modern-table" hover>
                <thead>
                  <tr>
                    <th>Tarea</th>
                    <th>Estudiante</th>
                    <th>Fecha</th>
                    <th>Nota</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluatedTasks.map((result) => (
                    <tr key={result.activityResultId}>
                      <td>
                        <div className="fw-semibold">{result.activityTitle}</div>
                      </td>
                      <td>{result.studentName}</td>
                      <td>{formatDate(result.submittedAt)}</td>
                      <td>
                        <Badge bg={getScoreColor(result.score)} className="score-badge">
                          <FaStar size={10} className="me-1" />
                          {result.score}/10
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEvaluateClick(result)}
                        >
                          <FaEye className="me-1" />
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state text-center py-5">
          <FaTasks size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No hay tareas entregadas</h5>
          <p className="text-muted">Las tareas aparecerán aquí cuando los estudiantes las entreguen</p>
        </div>
      )}

      {/* Modal de evaluación */}
      <Modal
        show={showModal && selectedResult !== null}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className="evaluation-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedResult?.score !== null ? 'Ver Evaluación' : 'Evaluar Tarea'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult ? (
            <div>
              {/* Información de la tarea */}
              <div className="evaluation-section mb-4">
                <h6 className="section-title">Información de la Tarea</h6>
                <div className="info-grid">
                  <div><strong>Tarea:</strong> {selectedResult.activityTitle}</div>
                  <div><strong>Estudiante:</strong> {selectedResult.studentName}</div>
                  <div><strong>Entregado:</strong> {formatDate(selectedResult.submittedAt)}</div>
                </div>
              </div>

              {/* Respuesta del estudiante */}
              <div className="evaluation-section mb-4">
                <h6 className="section-title">Respuesta del Estudiante</h6>
                <div className="student-response">
                  {selectedResult.textAnswer ? (
                    <p className="response-text">{selectedResult.textAnswer}</p>
                  ) : (
                    <p className="text-muted">No hay comentario de texto.</p>
                  )}
                </div>
              </div>

              {/* Archivo entregado */}
              {selectedResult.fileName && (
                <div className="evaluation-section mb-4">
                  <h6 className="section-title">Archivo Entregado</h6>
                  <div className="file-download">
                    <a
                      href={`http://localhost:8080/api/activity-result/${selectedResult.activityResultId}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={selectedResult.fileName}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <FaDownload className="me-1" />
                      {selectedResult.fileName}
                    </a>
                  </div>
                </div>
              )}

              {/* Evaluación */}
              <div className="evaluation-section">
                <h6 className="section-title">Evaluación</h6>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nota (0-10)</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                          disabled={selectedResult.score !== null}
                          className="modern-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group>
                    <Form.Label>Comentarios y Feedback</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      disabled={selectedResult.score !== null}
                      className="modern-input"
                      placeholder="Escribe aquí tus comentarios para el estudiante..."
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>
          ) : (
            <p>Cargando...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          {selectedResult?.score === null && (
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={!score || !feedback.trim()}
            >
              <FaCheck className="me-1" />
              Guardar Evaluación
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default TeacherTaskList;