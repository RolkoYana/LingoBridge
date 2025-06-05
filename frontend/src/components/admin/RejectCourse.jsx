import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";
import "./RejectCourse.css";

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
      
      setTimeout(() => {
        console.log("Curso rechazado:", data.message);
        onReject(courseId); // elimina el curso rechazado de `PendingCourses`
      }, 800);
      
    } catch (error) {
      console.error("Error al rechazar el curso:", error.message);
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={rejectCourse}
      disabled={loading || rejected}
      className={`btn-admin-danger ${rejected ? 'btn-danger-completed' : ''}`}
      size="sm"
      title={loading ? "Rechazando curso..." : rejected ? "Curso rechazado" : "Rechazar curso"}
    >
      {loading ? (
        <>
          <FaSpinner className="me-1 fa-spin" />
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