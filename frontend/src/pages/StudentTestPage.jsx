import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api/api";

const StudentTestPage = () => {
  const { courseId, activityId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchWithAuth(
          `/student/activity/${activityId}/questions`
        );
        setQuestions(data);
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
      }
    };

    loadQuestions();
  }, [activityId]);

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submissionData = {
      answers: Object.entries(answers).map(([questionId, optionId]) => ({
        questionId: Number(questionId),
        selectedOptionId: Number(optionId),
      })),
    };

    try {
      const result = await fetchWithAuth(
        `/student/activity/${activityId}/submit-test`,
        {
          method: "POST",
          body: JSON.stringify(submissionData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTestResult(result);
      setShowResultModal(true);
    } catch (error) {
      console.error("Error al enviar las respuestas:", error);
      alert("Error al enviar las respuestas");
    }
  };

  const handleGoToStudentHome = () => {
    navigate(`/student/course/${courseId}`);
  };

  const closeModal = () => {
    setShowResultModal(false);
    setTestResult(null);
  };

  return (
    <div className="container my-4">
      <h4 className="mb-4">Test: Responde las preguntas</h4>
      {questions.length === 0 ? (
        <div className="alert alert-info">Cargando preguntas...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            <div className="mb-4" key={question.id}>
              <p>
                <strong>{question.text}</strong>
              </p>
              {question.options.map((option) => (
                <div className="form-check" key={option.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={() => handleAnswerChange(question.id, option.id)}
                    id={`q${question.id}_opt${option.id}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`q${question.id}_opt${option.id}`}
                  >
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button type="submit" className="btn btn-primary">
            Enviar Test
          </button>
        </form>
      )}

      {/* Modal */}
      {showResultModal && testResult && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">¡Test Completado!</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3 d-flex justify-content-between">
                  <strong>Puntuación:</strong>
                  <span className="text-success fw-bold">
                    {testResult.score}/10
                  </span>
                </div>
                <div className="mb-3 d-flex justify-content-between">
                  <strong>Estado:</strong>
                  <span
                    className={`fw-bold ${
                      testResult.completed ? "text-success" : "text-warning"
                    }`}
                  >
                    {testResult.completed ? "Completado" : "Pendiente"}
                  </span>
                </div>
                <div className="mb-3 d-flex justify-content-between">
                  <strong>Corrección:</strong>
                  <span
                    className={`fw-bold ${
                      testResult.autoCorrected ? "text-success" : "text-warning"
                    }`}
                  >
                    {testResult.autoCorrected ? "Automática" : "Manual"}
                  </span>
                </div>
                {testResult.feedback && (
                  <div className="mb-3">
                    <strong>Comentarios:</strong>
                    <div className="alert alert-secondary mt-2">
                      {testResult.feedback}
                    </div>
                  </div>
                )}
                <div className="mb-3 d-flex justify-content-between">
                  <strong>Fecha de finalización:</strong>
                  <span>{testResult.completedAt}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={handleGoToStudentHome}
                  className="btn btn-primary"
                >
                  Ir a Página Principal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTestPage;
