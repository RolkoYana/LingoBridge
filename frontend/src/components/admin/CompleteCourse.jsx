import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";

const CompleteCourse = ({ courseId, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const completeCourse = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        `/admin/complete-course/${courseId}`,
        {
          method: "PUT",
        }
      );

      setCompleted(true);
      
      // Esperar un momento para mostrar el éxito antes de remover
      setTimeout(() => {
        alert("Curso finalizado correctamente.");
        onComplete(courseId); // elimina el curso de la tabla de cursos activos
      }, 800);
      
    } catch (error) {
      alert("Error al finalizar el curso.");
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={completeCourse} 
      disabled={loading || completed}
      className={`btn-complete-course ${completed ? 'completing' : ''}`}
      title={loading ? "Finalizando curso..." : "Finalizar curso"}
    >
      {loading ? (
        <>
          <FaSpinner className="me-1" style={{ animation: 'spin 1s linear infinite' }} />
          Finalizando...
        </>
      ) : completed ? (
        <>
          <FaCheckCircle className="me-1" />
          Finalizado
        </>
      ) : (
        <>
          <FaCheckCircle className="me-1" />
          Finalizar
        </>
      )}
    </Button>
  );
};

export default CompleteCourse;