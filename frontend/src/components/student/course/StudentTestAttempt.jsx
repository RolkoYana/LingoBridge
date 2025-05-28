import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "../../../api/api";

const StudentTestAttempt = () => {
  const { activityId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchWithAuth(
          `/student/activity/${activityId}/questions`
        );
        console.log("Datos de preguntas recibidos:", data);
        console.log("Ejemplo de pregunta:", data[0]);
        console.log("Ejemplo de opciones:", data[0]?.options);
        setQuestions(data);
      } catch (err) {
        console.error("Error al cargar preguntas:", err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
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
    } else {
      console.warn(
        `Intentando guardar un valor inválido en questionId ${questionId}:`,
        selectedOptionId
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Estado actual de answers antes del submit:", answers);
    console.log(
      "Preguntas disponibles:",
      questions.map((q) => q.id)
    );

    if (Object.keys(answers).length !== questions.length) {
      alert("Por favor responde todas las preguntas antes de enviar.");
      return;
    }

    const submissionData = {
      answers: Object.entries(answers)
        .map(([questionId, selectedOptionId]) => ({
          questionId: Number(questionId),
          selectedOptionId: Number(selectedOptionId), // Simplificado
        }))
        .filter(
          (answer) =>
            answer.selectedOptionId !== null &&
            answer.selectedOptionId !== undefined &&
            !isNaN(answer.selectedOptionId)
        ), // Filtro mejorado
    };

    console.log(
      "Datos que envío al backend:",
      JSON.stringify(submissionData, null, 2)
    );

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
      alert("Test enviado y corregido automáticamente");
    } catch (err) {
      console.error("Error al enviar el test:", err);
      alert("Error al enviar el test");
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <h3>Test: {questions.length > 0 ? questions[0].activityTitle : ""}</h3>

      <Form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="mb-4">
            <strong>{q.text}</strong>
            {q.options.map((opt) => {
              console.log(
                `Renderizando opción: questionId=${q.id}, optionId=${
                  opt.id
                }, tipo=${typeof opt.id}`
              );
              return (
                <Form.Check
                  key={opt.id}
                  type="radio"
                  name={`question-${q.id}`}
                  label={opt.text}
                  value={opt.id} // IMPORTANTE: Agregar el value
                  checked={answers[q.id] === opt.id}
                  onChange={(e) => {
                    console.log("onChange disparado:", {
                      questionId: q.id,
                      optionId: opt.id,
                      eventValue: e.target.value,
                      eventValueType: typeof e.target.value,
                    });
                    handleSelect(q.id, Number(e.target.value));
                  }}
                />
              );
            })}
          </div>
        ))}

        <Button type="submit" variant="primary">
          Enviar Test
        </Button>
      </Form>
    </div>
  );
};

export default StudentTestAttempt;
