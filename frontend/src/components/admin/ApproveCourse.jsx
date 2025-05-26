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
        alert(data.message);
        onApprove(courseId); // elimina el curso aprobado de `PendingCourses`
      }, 800);
      
    } catch (error) {
      alert("Error al aprobar el curso: " + error.message);
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={approveCourse}
      disabled={loading || approved}
      className={`btn-approve-course ${approved ? 'approving' : ''}`}
      title={loading ? "Aprobando curso..." : "Aprobar curso"}
    >
      {loading ? (
        <>
          <FaSpinner className="me-1" style={{ animation: 'spin 1s linear infinite' }} />
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