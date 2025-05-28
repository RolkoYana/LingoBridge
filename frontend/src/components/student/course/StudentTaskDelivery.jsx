import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../api/api";
import { Button, Form, Alert, Spinner } from "react-bootstrap";

const StudentTaskDelivery = () => {
  const { courseId, activityId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token de autenticación.");
        if (!courseId || !activityId)
          throw new Error("Faltan parámetros requeridos");

        // Obtener actividades del curso para validar que la actividad es una tarea
        const activities = await fetchWithAuth(
          `/student/course/${courseId}/activity`
        );

        const currentActivity = activities.find(
          (act) => act.id.toString() === activityId.toString()
        );

        if (!currentActivity)
          throw new Error(`No se encontró la actividad con ID ${activityId}`);
        if (currentActivity.type !== "TASK")
          throw new Error(
            `La actividad no es una tarea, es: ${currentActivity.type}`
          );

        // Usar los datos básicos de la actividad para mostrar
        setTask({
          id: currentActivity.id,
          title: currentActivity.title,
          description: currentActivity.description,
          dueDate: currentActivity.dueDate,
          type: currentActivity.type,
        });
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && activityId) {
      loadTask();
    } else {
      setError("Parámetros de URL inválidos");
      setLoading(false);
    }
  }, [courseId, activityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      return;
    }

    if (!file) {
      setError("Debes adjuntar un archivo antes de enviar la tarea.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("textAnswer", textAnswer || "");
      formData.append("file", file);

      console.log("=== DEBUG FormData ===");
      for (let [key, value] of formData.entries()) {
        console.log(
          `FormData ${key}:`,
          value instanceof File ? `File: ${value.name}` : value
        );
      }
      console.log("======================");

      // Usamos fetchWithAuth y pasamos body = formData
      const result = await fetchWithAuth(
        `/student/activity/${activityId}/submit-task`,
        {
          method: "POST",
          body: formData,
          // NO agregamos headers para Content-Type porque fetchWithAuth lo controla
        }
      );

      // result ya es JSON porque el backend responde JSON con éxito
      console.log("Tarea enviada exitosamente:", result);

      setShowSuccessModal(true);
      setTextAnswer("");
      setFile(null);
    } catch (err) {
      console.error("Error completo:", err);

      if (
        err.message.includes("sesión ha expirado") ||
        err.message.includes("401")
      ) {
        setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/login");
        }, 3000);
      } else {
        setError(`Error al enviar la tarea: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToStudentHome = () => {
    navigate(`/student/course/${courseId}`);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("El archivo es demasiado grande. Máximo 10MB.");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Cargando tarea...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <div className="mt-2">
          <small>
            <strong>Debug info:</strong>
            <br />
            CourseId: {courseId}
            <br />
            ActivityId: {activityId}
            <br />
            Token exists: {localStorage.getItem("token") ? "Yes" : "No"}
            <br />
            Username exists: {localStorage.getItem("username") ? "Yes" : "No"}
          </small>
        </div>
      </Alert>
    );
  }

  if (!task) {
    return (
      <Alert variant="warning">
        No se pudo cargar la información de la tarea.
      </Alert>
    );
  }

  return (
    <div>
      <h4>{task.title}</h4>
      <p>{task.description}</p>

      {task.dueDate && (
        <p>
          <strong>Fecha límite:</strong> {task.dueDate}
        </p>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="textAnswer" className="mb-3">
          <Form.Label>Tu respuesta *</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            required
          />
        </Form.Group>

        <Form.Group controlId="fileUpload" className="mb-3">
          <Form.Label>Adjuntar archivo (opcional)</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
          {file && (
            <Form.Text className="text-muted">
              Archivo seleccionado: {file.name} (
              {(file.size / 1024 / 1024).toFixed(2)} MB)
            </Form.Text>
          )}
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          disabled={submitting || !textAnswer.trim()}
        >
          {submitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Enviando...
            </>
          ) : (
            "Enviar tarea"
          )}
        </Button>
      </Form>

      {showSuccessModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">¡Tarea Enviada!</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <i
                    className="fas fa-check-circle text-success"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
                <h6 className="mb-3">Tu tarea ha sido enviada correctamente</h6>
                <p className="text-muted">
                  La tarea será evaluada por el profesor y recibirás la
                  calificación próximamente.
                </p>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  onClick={handleGoToStudentHome}
                  className="btn btn-primary"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTaskDelivery;
