import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Badge, Alert, Modal } from "react-bootstrap";
import { 
  FaSave, 
  FaTimes, 
  FaPlus, 
  FaTrash, 
  FaQuestionCircle,
  FaFileAlt,
  FaCheck
} from "react-icons/fa";
import "./EditActivityForm.css";

const EditActivityForm = ({ activity, formData, onCancel, onSave }) => {
  const [title, setTitle] = useState(formData.title || "");
  const [description, setDescription] = useState(formData.description || "");
  const [dueDate, setDueDate] = useState(
    formData.dueDate ? formData.dueDate.split("T")[0] : ""
  );
  const [questions, setQuestions] = useState(formData.questions || []);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validación
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = "El título es obligatorio";
    if (!description.trim()) newErrors.description = "La descripción es obligatoria";
    if (!dueDate) newErrors.dueDate = "La fecha límite es obligatoria";
    
    if (activity.type === "TEST") {
      if (questions.length === 0) {
        newErrors.questions = "Debe haber al menos una pregunta";
      } else {
        questions.forEach((q, i) => {
          if (!q.text.trim()) {
            newErrors[`question_${i}`] = "El texto de la pregunta es obligatorio";
          }
          if (q.options.length < 2) {
            newErrors[`question_${i}_options`] = "Debe haber al menos 2 opciones";
          }
          const hasCorrectAnswer = q.options.some(opt => opt.correct);
          if (!hasCorrectAnswer) {
            newErrors[`question_${i}_correct`] = "Debe marcar al menos una respuesta correcta";
          }
        });
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de cambios en preguntas y opciones
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
    // Limpiar error específico
    const newErrors = { ...errors };
    delete newErrors[`question_${index}`];
    setErrors(newErrors);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleOptionCorrectChange = (qIndex, oIndex, checked) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].correct = checked;
    setQuestions(newQuestions);
    // Limpiar error de respuesta correcta
    const newErrors = { ...errors };
    delete newErrors[`question_${qIndex}_correct`];
    setErrors(newErrors);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: [
          { text: "", correct: false },
          { text: "", correct: false }
        ],
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    // Limpiar errores relacionados
    const newErrors = { ...errors };
    delete newErrors[`question_${index}`];
    delete newErrors[`question_${index}_options`];
    delete newErrors[`question_${index}_correct`];
    setErrors(newErrors);
  };

  const handleAddOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ text: "", correct: false });
    setQuestions(newQuestions);
    // Limpiar error de opciones
    const newErrors = { ...errors };
    delete newErrors[`question_${qIndex}_options`];
    setErrors(newErrors);
  };

  const handleDeleteOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
      (_, j) => j !== oIndex
    );
    setQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Mostrar modal de éxito (sin llamar a onSave)
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="edit-activity-form">
      <div className="form-header">
        <div className="form-title-section">
          {activity.type === "TEST" ? (
            <FaQuestionCircle className="form-icon test" />
          ) : (
            <FaFileAlt className="form-icon task" />
          )}
          <div>
            <h4 className="form-title">
              Editar {activity.type === "TEST" ? "Test" : "Tarea"}
            </h4>
            <p className="form-subtitle">
              Modifica la información de la actividad
            </p>
          </div>
        </div>
        <Badge 
          bg={activity.type === "TEST" ? "danger" : "primary"}
          className="activity-badge"
        >
          {activity.type === "TEST" ? "Test" : "Ejercicio Escrito"}
        </Badge>
      </div>

      {Object.keys(errors).length > 0 && (
        <Alert variant="danger" className="error-alert">
          <strong>Por favor, corrige los siguientes errores:</strong>
          <ul className="mb-0 mt-2">
            {Object.values(errors).map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="activity-form">
        {/* Información básica */}
        <Card className="form-section">
          <Card.Header>
            <h6 className="section-title">Información básica</h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Título *</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ingresa el título de la actividad"
                    isInvalid={!!errors.title}
                    className="form-input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Fecha límite *</Form.Label>
                  <Form.Control
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    isInvalid={!!errors.dueDate}
                    className="form-input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dueDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-0">
              <Form.Label className="form-label">Descripción *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe la actividad y sus objetivos"
                isInvalid={!!errors.description}
                className="form-textarea"
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Preguntas del test */}
        {activity.type === "TEST" && (
          <Card className="form-section">
            <Card.Header className="questions-header">
              <h6 className="section-title">
                Preguntas del Test ({questions.length})
              </h6>
              <Button
                type="button"
                variant="outline-success"
                size="sm"
                onClick={handleAddQuestion}
                className="add-question-btn"
              >
                <FaPlus className="me-1" />
                Añadir Pregunta
              </Button>
            </Card.Header>
            <Card.Body>
              {questions.length === 0 ? (
                <div className="no-questions">
                  <FaQuestionCircle className="no-questions-icon" />
                  <p>No hay preguntas añadidas</p>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleAddQuestion}
                  >
                    <FaPlus className="me-1" />
                    Añadir primera pregunta
                  </Button>
                </div>
              ) : (
                <div className="questions-list">
                  {questions.map((q, i) => (
                    <div key={i} className="question-card">
                      <div className="question-header">
                        <div className="question-number">
                          Pregunta {i + 1}
                        </div>
                        <Button
                          type="button"
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteQuestion(i)}
                          className="delete-question-btn"
                        >
                          <FaTrash />
                        </Button>
                      </div>

                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          value={q.text}
                          onChange={(e) => handleQuestionChange(i, e.target.value)}
                          placeholder={`Escribe la pregunta ${i + 1}`}
                          isInvalid={!!errors[`question_${i}`]}
                          className="question-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors[`question_${i}`]}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <div className="options-section">
                        <div className="options-header">
                          <span className="options-label">Opciones de respuesta</span>
                          <Button
                            type="button"
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleAddOption(i)}
                            className="add-option-btn"
                          >
                            <FaPlus className="me-1" />
                            Añadir opción
                          </Button>
                        </div>

                        {q.options.map((opt, j) => (
                          <div key={j} className="option-row">
                            <div className="option-letter">
                              {String.fromCharCode(65 + j)}
                            </div>
                            <Form.Control
                              type="text"
                              value={opt.text}
                              onChange={(e) => handleOptionChange(i, j, e.target.value)}
                              placeholder={`Opción ${String.fromCharCode(65 + j)}`}
                              className="option-input"
                            />
                            <Form.Check
                              type="checkbox"
                              checked={opt.correct}
                              onChange={(e) => handleOptionCorrectChange(i, j, e.target.checked)}
                              label=""
                              className="correct-checkbox"
                            />
                            <div className="correct-label">
                              {opt.correct && <FaCheck className="correct-icon" />}
                              Correcta
                            </div>
                            {q.options.length > 2 && (
                              <Button
                                type="button"
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteOption(i, j)}
                                className="delete-option-btn"
                              >
                                <FaTrash />
                              </Button>
                            )}
                          </div>
                        ))}

                        {(errors[`question_${i}_options`] || errors[`question_${i}_correct`]) && (
                          <div className="options-errors">
                            {errors[`question_${i}_options`] && (
                              <div className="text-danger">{errors[`question_${i}_options`]}</div>
                            )}
                            {errors[`question_${i}_correct`] && (
                              <div className="text-danger">{errors[`question_${i}_correct`]}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Botones de acción */}
        <div className="form-actions">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={onCancel}
            className="cancel-btn"
          >
            <FaTimes className="me-1" />
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="save-btn"
          >
            <FaSave className="me-1" />
            Guardar Cambios
          </Button>
        </div>
      </Form>

      {/* Modal de éxito - VERSIÓN SIMPLE */}
      <Modal 
        show={showSuccessModal} 
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCheck className="text-success me-2" />
            ¡Guardado con éxito!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Los cambios se han guardado correctamente.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCloseModal}
          >
            Continuar editando
          </Button>
          <Button 
            variant="primary" 
            onClick={onCancel}
          >
            Volver al listado
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditActivityForm;