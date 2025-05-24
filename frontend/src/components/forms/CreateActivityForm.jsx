import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { fetchWithAuth } from "../../api/api";

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

      alert(
        `Actividad ${initialData ? "actualizada" : "creada"} correctamente`
      );
      onActivityCreated?.();
      clearForm();
      onCancel?.();
    } catch (err) {
      console.error("Error guardando la actividad:", err);
      alert("Error guardando la actividad");
    }
  };

  if (!visible) return null; // No mostrar nada si no está visible

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Título</Form.Label>
        <Form.Control
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        />
      </Form.Group>

      <Row className="mb-3">
        <Col>
          <Form.Label>Tipo</Form.Label>
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
          <Form.Label>Fecha límite</Form.Label>
          <Form.Control
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </Col>
      </Row>

      {type === "TEST" && (
        <div>
          <h5>Preguntas</h5>
          {questions.map((q, qIndex) => (
            <Card key={qIndex} className="mb-3 p-3">
              <Form.Group
                className="mb-2"
                controlId={`question-text-${qIndex}`}
              >
                <Form.Label>Texto de la pregunta</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    value={q.text}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIndex].text = e.target.value;
                      setQuestions(updated);
                    }}
                    required
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    Eliminar pregunta
                  </Button>
                </div>
              </Form.Group>

              {q.options.map((opt, oIndex) => (
                <Form.Check
                  key={oIndex}
                  type="radio"
                  name={`correct-${qIndex}`}
                  className="mb-2"
                  label={
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        required
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => removeOption(qIndex, oIndex)}
                      >
                        X
                      </Button>
                    </div>
                  }
                  checked={q.correctIndex === oIndex}
                  onChange={() => {
                    const updated = [...questions];
                    updated[qIndex].correctIndex = oIndex;
                    setQuestions(updated);
                  }}
                />
              ))}

              <Button
                size="sm"
                onClick={() => addOption(qIndex)}
                className="mt-2"
                variant="secondary"
              >
                Añadir opción
              </Button>
            </Card>
          ))}

          <Button variant="secondary" onClick={addQuestion}>
            Añadir pregunta
          </Button>
        </div>
      )}

      <div className="mt-3 d-flex justify-content-end">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? "Guardar Cambios" : "Crear Actividad"}
        </Button>
      </div>
    </Form>
  );
};

export default CreateActivityForm;
