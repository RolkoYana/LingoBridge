import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Card, Modal } from "react-bootstrap";
import { 
  FaPlus, 
  FaTrash, 
  FaQuestionCircle, 
  FaFileAlt, 
  FaCheck 
} from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";
import "./CreateActivityForm.css";

const CreateActivityForm = ({
  courseId,
  onActivityCreated,
  initialData = null,
  onCancel,
  visible = true,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("TASK");
  const [dueDate, setDueDate] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Cuando cambie visibility o initialData reseteamos el formulario (por si se cierra toggle)
  useEffect(() => {
    if (!visible) {
      clearForm();
    } else if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setType(initialData.type || "TASK");
      setDueDate(initialData.dueDate || "");

      if (initialData.type === "TEST" && initialData.questions) {
        // Adaptar formato preguntas para editar
        const formattedQuestions = initialData.questions.map((q) => ({
          text: q.text || "",
          options: q.options.map((opt) => opt.text || ""),
          correctIndex: q.options.findIndex((opt) => opt.correct) ?? null,
        }));
        setQuestions(formattedQuestions);
      } else {
        setQuestions([]);
      }
    } else {
      clearForm();
    }
  }, [initialData, visible]);

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setType("TASK");
    setDueDate("");
    setQuestions([]);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: [], correctIndex: null }]);
  };

  const removeQuestion = (qIndex) => {
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);

    // Ajustar correctIndex si es necesario
    if (updated[qIndex].correctIndex === oIndex) {
      updated[qIndex].correctIndex = null;
    } else if (updated[qIndex].correctIndex > oIndex) {
      updated[qIndex].correctIndex -= 1;
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (type === "TASK") {
        // Crear o actualizar actividad de tipo tarea (sin preguntas)
        const activityDto = {
          title,
          description,
          type,
          dueDate,
        };

        if (initialData?.id) {
          await fetchWithAuth(`/teacher/activity/${initialData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(activityDto),
          });
        } else {
          await fetchWithAuth(`/teacher/course/${courseId}/activity`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(activityDto),
          });
        }
      } else if (type === "TEST") {
        // Crear o actualizar test con preguntas y opciones
        const dto = {
          title,
          description,
          dueDate,
          questions: questions.map((q) => ({
            text: q.text,
            options: q.options.map((opt, i) => ({
              text: opt,
              correct: i === q.correctIndex,
            })),
          })),
        };

        if (initialData?.id) {
          await fetchWithAuth(`/teacher/test/${initialData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto),
          });
        } else {
          await fetchWithAuth(`/teacher/course/${courseId}/test`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto),
          });
        }
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error guardando la actividad:", err);
      alert("Error guardando la actividad");
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    onActivityCreated?.();
    clearForm();
    onCancel?.();
  };

  if (!visible) return null; // No mostrar nada si no está visible

  return (
    <div className="create-activity-form">
      <div className="activity-form-header">
        <div className={`activity-form-icon ${type.toLowerCase()}`}>
          {type === "TEST" ? <FaQuestionCircle /> : <FaFileAlt />}
        </div>
        <div>
          <h5 className="activity-form-title">
            {initialData ? "Editar" : "Crear"} {type === "TEST" ? "Test" : "Tarea"}
            <span className={`activity-type-badge ${type.toLowerCase()}`}>
              {type === "TEST" ? "Test" : "Ejercicio"}
            </span>
          </h5>
          <p className="activity-form-subtitle">
            {initialData 
              ? "Modifica la información de la actividad" 
              : "Configura los detalles de la nueva actividad"
            }
          </p>
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="required-field">Título</Form.Label>
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la actividad"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe los objetivos y contenido de la actividad"
          />
        </Form.Group>

        <Row className="mb-3">
          <Col>
            <Form.Label className="required-field">Tipo</Form.Label>
            <Form.Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={!!initialData} // No permitir cambiar tipo en edición (mejor práctica)
            >
              <option value="TASK">Tarea</option>
              <option value="TEST">Test</option>
            </Form.Select>
          </Col>

          <Col>
            <Form.Label className="required-field">Fecha límite</Form.Label>
            <Form.Control
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </Col>
        </Row>

        {type === "TEST" && (
          <div className="questions-section">
            <div className="questions-title">
              <FaQuestionCircle />
              Preguntas del Test
              <span className="questions-count">{questions.length}</span>
            </div>
            
            {questions.length === 0 ? (
              <div className="text-center py-4">
                <FaQuestionCircle className="text-muted mb-2" style={{fontSize: '48px'}} />
                <p className="text-muted mb-3">No hay preguntas añadidas</p>
                <Button
                  variant="primary"
                  onClick={addQuestion}
                  className="add-question-btn"
                >
                  <FaPlus className="me-1" />
                  Añadir primera pregunta
                </Button>
              </div>
            ) : (
              <>
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="question-card">
                    <div className="question-header">
                      <div className="question-number">
                        Pregunta {qIndex + 1}
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="remove-question-btn"
                        onClick={() => removeQuestion(qIndex)}
                      >
                        <FaTrash className="me-1" />
                        Eliminar
                      </Button>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Control
                        value={q.text}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIndex].text = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder={`Escribe la pregunta ${qIndex + 1}`}
                        className="question-text-input"
                        required
                      />
                    </Form.Group>

                    <div className="options-section">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted fw-bold">Opciones de respuesta</small>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => addOption(qIndex)}
                          className="add-option-btn"
                        >
                          <FaPlus className="me-1" />
                          Añadir opción
                        </Button>
                      </div>

                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="option-item">
                          <Form.Check
                            type="radio"
                            name={`correct-${qIndex}`}
                            className="option-radio"
                            checked={q.correctIndex === oIndex}
                            onChange={() => {
                              const updated = [...questions];
                              updated[qIndex].correctIndex = oIndex;
                              setQuestions(updated);
                            }}
                          />
                          <Form.Control
                            type="text"
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(qIndex, oIndex, e.target.value)
                            }
                            placeholder={`Opción ${String.fromCharCode(65 + oIndex)}`}
                            className="option-input"
                            required
                          />
                          {q.options.length > 2 && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="option-remove-btn"
                              onClick={() => removeOption(qIndex, oIndex)}
                            >
                              <FaTrash />
                            </Button>
                          )}
                        </div>
                      ))}

                      {q.options.length === 0 && (
                        <div className="text-muted text-center py-2">
                          <small>Añade al menos 2 opciones de respuesta</small>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <Button 
                  variant="secondary" 
                  onClick={addQuestion}
                  className="add-question-btn"
                >
                  <FaPlus className="me-1" />
                  Añadir otra pregunta
                </Button>
              </>
            )}
          </div>
        )}

        <div className="form-actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? "Guardar Cambios" : "Crear Actividad"}
          </Button>
        </div>
      </Form>

      {/* Modal de éxito */}
      <Modal 
        show={showSuccessModal} 
        onHide={handleCloseModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCheck className="text-success me-2" />
            ¡{initialData ? "Actualizado" : "Creado"} con éxito!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            La {type === "TEST" ? "prueba" : "tarea"} se ha {initialData ? "actualizado" : "creado"} correctamente.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={handleCloseModal}
          >
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateActivityForm;