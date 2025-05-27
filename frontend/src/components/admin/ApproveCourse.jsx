import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";

const ApproveCourse = ({ courseId, onApprove }) => {
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  const approveCourse = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth(`/admin/approve-course/${courseId}`, {
        method: "PUT",
      });

      setApproved(true);
      
      // Esperar un momento para mostrar el éxito antes de remover
      setTimeout(() => {
        // Usar una notificación más elegante en lugar de alert
        console.log("Curso aprobado:", data.message);
        onApprove(courseId); // elimina el curso aprobado de `PendingCourses`
      }, 800);
      
    } catch (error) {
      console.error("Error al aprobar el curso:", error.message);
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={approveCourse}
      disabled={loading || approved}
      className={`btn-admin-success ${approved ? 'btn-success-completed' : ''}`}
      size="sm"
      title={loading ? "Aprobando curso..." : approved ? "Curso aprobado" : "Aprobar curso"}
    >
      {loading ? (
        <>
          <FaSpinner className="me-1 fa-spin" />
          Aprobando...
        </>
      ) : approved ? (
        <>
          <FaCheck className="me-1" />
          Aprobado
        </>
      ) : (
        <>
          <FaCheck className="me-1" />
          Aprobar
        </>
      )}
    </Button>
  );
};

export default ApproveCourse;