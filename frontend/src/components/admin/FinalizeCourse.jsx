import React, { useState } from "react";
import { fetchWithAuth } from "../../api/api";

const FinalizeCourse = () => {
  const [loading, setLoading] = useState(false);

  // finalizar el curso
  const finalizeCourse = async () => {
    setLoading(true); // desactiva el boton
    try {
      const response = await fetchWithAuth("/finalize-course/${courseId", {
        method: "PUT",
      });
      alert(response.message);
    } catch (error) {
      alert("Error al finalizar el curso");
    }
    setLoading(false); // reactiva el boton
  };

  return (
    <button onClick={finalizeCourse} disabled={loading}>
      {loading ? "Finalizando..." : "Finalizar curso"}
    </button>
  );
};

export default FinalizeCourse;
