import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Modal, Button, Form } from "react-bootstrap";
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

      alert("✅ Evaluación guardada correctamente.");
      setShowModal(false);
      fetchResults(); // recarga la lista para ver cambios
    } catch (err) {
      console.error("Error al enviar evaluación:", err);
      alert("❌ No se pudo guardar la evaluación.");
    }
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="mt-4">
      <h4>Tareas entregadas por estudiantes</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Título de tarea</th>
            <th>Fecha de entrega</th>
            <th>Completado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.activityResultId}>
              <td>{r.studentName}</td>
              <td>{r.activityTitle}</td>
              <td>{r.submittedAt}</td>
              <td>{r.completed ? "Sí" : "No"}</td>
              <td>
                <button
                  className={`btn btn-sm ${
                    r.score !== null ? "btn-secondary" : "btn-primary"
                  }`}
                  onClick={() => handleEvaluateClick(r)}
                >
                  {r.score !== null ? "Evaluado" : "Evaluar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de evaluación */}
      <Modal
        show={showModal && selectedResult !== null}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Evaluar tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult ? (
            <>
              <div className="mb-3">
                <h6>Comentario del estudiante:</h6>
                <p>{selectedResult.textAnswer || "No hay comentario."}</p>
              </div>

              {selectedResult.fileName ? (
                <div className="mb-3">
                  <h6>Archivo entregado:</h6>
                  <a
                    href={`http://localhost:8080/api/activity-result/${selectedResult.activityResultId}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={selectedResult.fileName}
                  >
                    {selectedResult.fileName}
                  </a>
                </div>
              ) : (
                <p>No se entregó archivo.</p>
              )}

              <Form>
                <Form.Group controlId="formScore">
                  <Form.Label>Nota (0-10)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    disabled={selectedResult.score !== null}
                  />
                </Form.Group>

                <Form.Group controlId="formFeedback" className="mt-3">
                  <Form.Label>Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={selectedResult.score !== null}
                  />
                </Form.Group>
              </Form>
            </>
          ) : (
            <p>Cargando...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={selectedResult && selectedResult.score !== null}
          >
            Guardar evaluación
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeacherTaskList;
