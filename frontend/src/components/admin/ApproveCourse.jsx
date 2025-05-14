import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../api/api";

// componente que permite al admin ver y aprobar los cursos

const ApproveCourse = ({ courseId, onApprove }) => {
  const approveCourse = async () => {
    try {
      const data = await fetchWithAuth(`/admin/approve-course/${courseId}`, {
        method: "PUT",
      });

      alert(data.message);
      onApprove(courseId); // elimina el curso aprobado de `PendingCourses`
    } catch (error) {
      alert("Error al aprobar el curso: " + error.message);
    }
  };

  return <button onClick={approveCourse}>Aprobar curso</button>;
};

export default ApproveCourse;
