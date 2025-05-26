import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";

const RejectCourse = ({ courseId, onReject }) => {
  const [loading, setLoading] = useState(false);
  const [rejected, setRejected] = useState(false);

  const rejectCourse = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth(`/admin/reject-course/${courseId}`, {
        method: "DELETE",
      });

      setRejected(true);
      
      // Esperar un momento para mostrar el éxito antes de remover
      setTimeout(() => {
        alert(data.message);
        onReject(courseId); // elimina el curso rechazado de `PendingCourses`
      }, 800);
      
    } catch (error) {
      alert("Error al rechazar el curso: " + error.message);
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={rejectCourse}
      disabled={loading || rejected}
      className={`btn-reject-course ms-2 ${rejected ? 'rejecting' : ''}`}
      title={loading ? "Rechazando curso..." : "Rechazar curso"}
    >
      {loading ? (
        <>
          <FaSpinner className="me-1" style={{ animation: 'spin 1s linear infinite' }} />
          Rechazando...
        </>
      ) : rejected ? (
        <>
          <FaTimes className="me-1" />
          Rechazado
        </>
      ) : (
        <>
          <FaTimes className="me-1" />
          Rechazar
        </>
      )}
    </Button>
  );
};

export default RejectCourse;