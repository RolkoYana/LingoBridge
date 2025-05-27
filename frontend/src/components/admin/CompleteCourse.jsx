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
        // Usar una notificación más elegante en lugar de alert
        console.log("Curso finalizado correctamente");
        onComplete(courseId); // elimina el curso de la tabla de cursos activos
      }, 800);
      
    } catch (error) {
      console.error("Error al finalizar el curso:", error.message);
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={completeCourse} 
      disabled={loading || completed}
      className={`btn-admin-primary btn-action-extended ${completed ? 'btn-primary-completed' : ''}`}
      size="sm"
      title={loading ? "Finalizando curso..." : completed ? "Curso finalizado" : "Finalizar curso"}
    >
      {loading ? (
        <>
          <FaSpinner className="me-1 fa-spin" />
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