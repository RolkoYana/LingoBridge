import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../api/api";
import { Button, Form, Alert, Spinner, Modal } from "react-bootstrap";
import "./StudentTaskDelivery.css";

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
        if (!courseId || !activityId) throw new Error("Faltan parámetros requeridos");

        // Obtener actividades del curso para validar que la actividad es una tarea
        const activities = await fetchWithAuth(`/student/course/${courseId}/activity`);

        const currentActivity = activities.find(
          (act) => act.id.toString() === activityId.toString()
        );

        if (!currentActivity) throw new Error(`No se encontró la actividad con ID ${activityId}`);
        if (currentActivity.type !== "TASK") {
          throw new Error(`La actividad no es una tarea, es: ${currentActivity.type}`);
        }

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

  const validateForm = () => {
    if (!textAnswer.trim()) {
      setError("Debes escribir una respuesta antes de enviar la tarea.");
      return false;
    }

    if (!file) {
      setError("Debes adjuntar un archivo para enviar la tarea.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("textAnswer", textAnswer);
      formData.append("file", file);

      const result = await fetchWithAuth(
        `/student/activity/${activityId}/submit-task`,
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("Tarea enviada exitosamente:", result);
      setShowSuccessModal(true);
      
      // Limpiar formulario
      setTextAnswer("");
      setFile(null);
      
    } catch (err) {
      console.error("Error al enviar tarea:", err);

      if (err.message.includes("sesión ha expirado") || err.message.includes("401")) {
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
    setShowSuccessModal(false);
    navigate(`/student/course/${courseId}`);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validar tamaño del archivo (10MB máximo)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("El archivo es demasiado grande. Máximo 10MB.");
        e.target.value = ""; 
        return;
      }
      
      setFile(selectedFile);
      setError(null); // Limpiar errores previos
    }
  };

  const isFormValid = () => {
    return textAnswer.trim() && file;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="loading-text">Cargando tarea...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-container">
        <Alert variant="danger" className="custom-alert alert-danger">
          {error}
        </Alert>
        <Button 
          variant="secondary" 
          onClick={() => navigate(`/student/course/${courseId}`)}
          className="mt-3"
        >
          ← Volver al curso
        </Button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-container">
        <Alert variant="warning" className="custom-alert alert-warning">
          No se pudo cargar la información de la tarea.
        </Alert>
        <Button 
          variant="secondary" 
          onClick={() => navigate(`/student/course/${courseId}`)}
          className="mt-3"
        >
          ← Volver al curso
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="task-container">
        <div className="task-header">
          <h4 className="task-title">{task.title}</h4>
          <p className="task-description">{task.description}</p>

          {task.dueDate && (
            <div className="task-due-date">
              <strong>📅 Fecha límite:</strong> {" "}
              {new Date(task.dueDate).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>

        <Form onSubmit={handleSubmit} className="task-form">
          {/* Respuesta de texto */}
          <div className="form-section">
            <Form.Group controlId="textAnswer" className="mb-3">
              <Form.Label>
                📝 Tu respuesta <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                required
                className="custom-textarea"
              />
              <Form.Text className="text-muted">
                Explica tu solución, proceso y conclusiones
              </Form.Text>
            </Form.Group>
          </div>

          {/* Archivo obligatorio */}
          <div className="form-section">
            <Form.Group controlId="fileUpload" className="mb-3">
              <Form.Label>
                📎 Archivo adjunto <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                required
                className="custom-file-input"
              />
              <Form.Text className="text-muted">
                Formatos permitidos: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP, RAR (máx. 10MB)
              </Form.Text>
              
              {file && (
                <div className="file-info">
                  ✅ Archivo seleccionado: <strong>{file.name}</strong> 
                  <span className="text-muted"> ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </Form.Group>
          </div>

        

          <Button
            type="submit"
            variant="primary"
            disabled={submitting || !isFormValid()}
            className="submit-btn"
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Enviando tarea...
              </>
            ) : !isFormValid() ? (
              "Completa todos los campos requeridos"
            ) : (
              "✉️ Enviar Tarea"
            )}
          </Button>
        </Form>
      </div>

      {/* Modal de éxito */}
      <Modal 
        show={showSuccessModal} 
        onHide={() => {}} 
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="bg-success text-white">
          <Modal.Title>¡Tarea Enviada Correctamente!</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="text-center">
          <div className="success-icon mb-3">
            <i className="fas fa-check-circle"></i>
          </div>
          <h5 className="mb-3">Tu tarea ha sido enviada</h5>
          <p className="text-muted">
            La tarea será evaluada por el profesor y recibirás la calificación próximamente.
          </p>
        </Modal.Body>
        
        <Modal.Footer className="justify-content-center">
          <Button 
            variant="primary" 
            onClick={handleGoToStudentHome}
            size="lg"
          >
            🏠 Volver al Curso
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudentTaskDelivery;