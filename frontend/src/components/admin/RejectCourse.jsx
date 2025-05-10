import React from "react";
import { fetchWithAuth } from "../../api/api";

// este componente permite a admin rechazar curso

const RejectCourse = ({ courseId, onReject }) => {
  const rejectCourse = async () => {
    try {
      const data = await fetchWithAuth(`/reject-course/${courseId}`, {
        method: "DELETE",
      });

      alert(data.message);
      onReject(courseId); // ✅ Elimina el curso rechazado de `PendingCourses`
    } catch (error) {
      alert("Error al rechazar el curso: " + error.message);
    }
  };

  return <button onClick={rejectCourse}>Rechazar curso</button>;
};

export default RejectCourse;
