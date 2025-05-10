import React, { useState } from "react";
import { fetchWithAuth } from "../../api/api";

const CompleteCourse = ({ courseId, onComplete }) => {
  const [loading, setLoading] = useState(false);

  const completeCourse = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/finalize-course/${courseId}`, {
        method: "PUT",
      });

      alert("Curso finalizado correctamente.");
      onComplete(courseId); // elimina el curso de la tabla de cursos activos
    } catch (error) {
      alert("Error al finalizar el curso.");
    }
    setLoading(false);
  };

  return (
    <button onClick={completeCourse} disabled={loading}>
      {loading ? "Finalizando..." : "Finalizar curso"}
    </button>
  );
};

export default CompleteCourse;
