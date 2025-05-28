import React, { useState } from "react";

const EditActivityForm = ({ activity, formData, onCancel, onSave }) => {
  const [title, setTitle] = useState(formData.title || "");
  const [description, setDescription] = useState(formData.description || "");
  const [dueDate, setDueDate] = useState(
    formData.dueDate ? formData.dueDate.split("T")[0] : ""
  );

  const [questions, setQuestions] = useState(formData.questions || []);

  // Manejo de cambios en preguntas y opciones
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
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
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: [{ text: "", correct: false }],
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleAddOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ text: "", correct: false });
    setQuestions(newQuestions);
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
    const updated = {
      title,
      description,
      dueDate,
      ...(activity.type === "TEST" ? { questions } : {}),
    };
    onSave(updated);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: 20, padding: 20, border: "1px solid #ccc" }}
    >
      <h3>Editar {activity.type === "TEST" ? "Test" : "Tarea"}</h3>

      <label>Título:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Descripción:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label>Fecha límite:</label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />

      {activity.type === "TEST" && (
        <>
          <h4>Preguntas</h4>
          {questions.map((q, i) => (
            <div
              key={i}
              style={{
                marginBottom: 20,
                padding: 10,
                border: "1px dashed #ccc",
              }}
            >
              <input
                type="text"
                value={q.text}
                onChange={(e) => handleQuestionChange(i, e.target.value)}
                placeholder={`Pregunta #${i + 1}`}
                required
                style={{ width: "100%" }}
              />
              <button
                type="button"
                onClick={() => handleDeleteQuestion(i)}
                style={{ marginTop: 5 }}
              >
                Eliminar pregunta
              </button>

              <h5>Opciones</h5>
              {q.options.map((opt, j) => (
                <div key={j} style={{ display: "flex", gap: 10 }}>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionChange(i, j, e.target.value)}
                    required
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={opt.correct}
                      onChange={(e) =>
                        handleOptionCorrectChange(i, j, e.target.checked)
                      }
                    />{" "}
                    Correcta
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(i, j)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => handleAddOption(i)}>
                + Añadir opción
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddQuestion}>
            + Añadir pregunta
          </button>
        </>
      )}

      <div style={{ marginTop: 20 }}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditActivityForm;
