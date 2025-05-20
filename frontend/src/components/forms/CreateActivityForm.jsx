import React, { useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { fetchWithAuth } from "../../api/api";

const CreateActivityForm = ({ courseId, onActivityCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("TAREA");
  const [dueDate, setDueDate] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: [], correctIndex: null }]);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
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
        // FUTURO: Este endpoint aún no existe, deberás crearlo si quieres soportar TASK
        const activityDto = {
          title,
          description,
          type,
          dueDate,
        };

        await fetchWithAuth(`/teacher/course/${courseId}/activity`, {
          method: "POST",
          body: JSON.stringify(activityDto),
        });

      } else if (type === "TEST") {
        // Estructura completa de TEST con preguntas y opciones
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

        await fetchWithAuth(`/teacher/course/${courseId}/test`, {
          method: "POST",
          body: JSON.stringify(dto),
        });
      }

      alert("Actividad creada correctamente");
      onActivityCreated?.();

    } catch (err) {
      console.error("Error al crear la actividad:", err);
      alert("Error al crear la actividad");
    }
  };

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
          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="TAREA">Tarea</option>
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
              <Form.Group className="mb-2">
                <Form.Label>Texto de la pregunta</Form.Label>
                <Form.Control
                  value={q.text}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[qIndex].text = e.target.value;
                    setQuestions(updated);
                  }}
                />
              </Form.Group>

              {q.options.map((opt, oIndex) => (
                <Form.Check
                  key={oIndex}
                  type="radio"
                  name={`correct-${qIndex}`}
                  label={
                    <Form.Control
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(qIndex, oIndex, e.target.value)
                      }
                    />
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

      <Button type="submit" variant="primary" className="mt-3">
        Crear Actividad
      </Button>
    </Form>
  );
};

export default CreateActivityForm;
