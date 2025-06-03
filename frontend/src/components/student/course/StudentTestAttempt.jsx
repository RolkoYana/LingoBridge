import React, { useEffect, useState } from "react";
import { Button, Form, Spinner, Alert, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../api/api";
import "./StudentTestAttempt.css";

const StudentTestAttempt = () => {
  const { courseId, activityId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchWithAuth(
          `/student/activity/${activityId}/questions`
        );
        console.log("Datos de preguntas recibidos:", data);
        setQuestions(data);
      } catch (err) {
        console.error("Error al cargar preguntas:", err);
        setError("Error al cargar las preguntas del test: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (activityId) {
      loadQuestions();
    }
  }, [activityId]);

  const handleSelect = (questionId, selectedOptionId) => {
    console.log("handleSelect llamado con:", {
      questionId,
      selectedOptionId,
      type: typeof selectedOptionId,
    });

    if (
      selectedOptionId !== undefined &&
      selectedOptionId !== null &&
      !isNaN(selectedOptionId)
    ) {
      const numericValue = Number(selectedOptionId);
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: numericValue,
      }));
      console.log(`Respuesta guardada - Pregunta ${questionId}:`, numericValue);

      if (showValidationAlert) {
        setShowValidationAlert(false);
      }
    } else {
      console.warn(
        `Intentando guardar un valor inválido en questionId ${questionId}:`,
        selectedOptionId
      );
    }
  };

  const getProgress = () => {
    const answered = Object.keys(answers).length;
    const total = questions.length;
    return {
      answered,
      total,
      percentage: total > 0 ? (answered / total) * 100 : 0,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Estado actual de answers antes del submit:", answers);

    // Validación: debe responder TODAS las preguntas
    if (Object.keys(answers).length !== questions.length) {
      setShowValidationAlert(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setError(null);

    const submissionData = {
      answers: Object.entries(answers)
        .map(([questionId, selectedOptionId]) => ({
          questionId: Number(questionId),
          selectedOptionId: Number(selectedOptionId),
        }))
        .filter(
          (answer) =>
            answer.selectedOptionId !== null &&
            answer.selectedOptionId !== undefined &&
            !isNaN(answer.selectedOptionId)
        ),
    };

    console.log("Datos que envío al backend:", JSON.stringify(submissionData, null, 2));

    try {
      const result = await fetchWithAuth(
        `/student/activity/${activityId}/submit-test`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        }
      );

      console.log("Resultado de la corrección:", result);

      setTestResult(result);
      setShowResultModal(true);

    } catch (err) {
      console.error("Error al enviar el test:", err);
      setError("Error al enviar el test: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Funciones para el modal
  const handleCloseModal = () => {
    setShowResultModal(false);
    setTestResult(null);
  };

  const handleGoToCourse = () => {
    setShowResultModal(false);
    navigate(`/student/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="test-loading">
        <Spinner animation="border" />
        <p>Cargando preguntas del test...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-container">
        <Alert variant="danger">{error}</Alert>
        <Button
          variant="secondary"
          onClick={() => navigate(`/student/course/${courseId}`)}
        >
          Volver al curso
        </Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="test-container">
        <Alert variant="warning">
          No se encontraron preguntas para este test.
        </Alert>
        <Button
          variant="secondary"
          onClick={() => navigate(`/student/course/${courseId}`)}
        >
          Volver al curso
        </Button>
      </div>
    );
  }

  const progress = getProgress();

  return (
    <>
      <div className="test-container">
        <h3 className="test-title">
          Test: {questions.length > 0 ? questions[0].activityTitle : ""}
        </h3>

        {/* Indicador de progreso */}
        <div className="progress-indicator">
          <div className="progress-text">
            Progreso: {progress.answered} de {progress.total} preguntas
            respondidas
          </div>
          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Alerta de validación */}
        {showValidationAlert && (
          <div className="validation-alert">
            ⚠️ Por favor responde todas las preguntas antes de enviar el test.
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <div key={q.id} className="question-item">
              <div className="question-counter">
                Pregunta {index + 1} de {questions.length}
              </div>
              <div className="question-text">{q.text}</div>

              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.id;

                return (
                  <div
                    key={opt.id}
                    className={`option-item ${isSelected ? "selected" : ""}`}
                  >
                    <Form.Check
                      type="radio"
                      name={`question-${q.id}`}
                      label={opt.text}
                      value={opt.id}
                      checked={isSelected}
                      onChange={(e) => {
                        handleSelect(q.id, Number(e.target.value));
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          <Button
            type="submit"
            className="submit-test-btn"
            disabled={submitting || Object.keys(answers).length === 0}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Enviando test...
              </>
            ) : (
              `Enviar Test (${progress.answered}/${progress.total})`
            )}
          </Button>
        </Form>
      </div>

      {/* Modal de resultados */}
      <Modal 
        show={showResultModal} 
        onHide={handleCloseModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="bg-success text-white">
          <Modal.Title>
            🎉 ¡Test Completado y Corregido!
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="text-center">
          {testResult && (
            <>
              {/* Puntuación */}
              <div className="mb-4">
                <h2 className="text-success mb-2">
                  {testResult.score || 0}/10
                </h2>
                <p className="text-muted">Tu puntuación final</p>
              </div>
              
              {/* Badge de estado */}
              <div className="mb-4">
                <span className="badge bg-success fs-6 px-3 py-2">
                  ✅ Test completado automáticamente
                </span>
              </div>
              
              {/* Feedback */}
              {testResult.feedback && (
                <div className="mb-3">
                  <strong>Comentarios:</strong>
                  <div className="alert alert-light mt-2 text-start">
                    {testResult.feedback}
                  </div>
                </div>
              )}
              
              {/* Fecha */}
              {testResult.completedAt && (
                <p className="text-muted small">
                  Completado el {new Date(testResult.completedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </>
          )}
        </Modal.Body>
        
        <Modal.Footer className="justify-content-center">
          <Button 
            variant="primary" 
            onClick={handleGoToCourse}
            size="lg"
          >
            🏠 Volver al Curso
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudentTestAttempt;