import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../api/api";

const AssignCourse = ({ courseId, onAssign }) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  // obtener lista de profesores disponibles
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await fetchWithAuth("/admin/teachers");
        setTeachers(data);
      } catch (error) {
        alert("Error al obtener profesores");
      }
    };
    fetchTeachers();
  }, []);

  // asignar curso al profesor
  const assignCourse = async () => {
    if (!selectedTeacher) {
      alert("Selecciona un profesor antes de asignar el curso");
      return;
    }
    try {
      const response = await fetchWithAuth(
        `/admin/assign-course/${courseId}?teacherUsername=${selectedTeacher}`,
        { method: "POST" }
      );
      alert(response.message);

      if (onAssign) {
        onAssign();
      }
    } catch (error) {
      alert("Error al asignar curso");
    }
  };

  return (
    <div>
      <h5>Asignar Curso a Profesor</h5>
      <select
        onChange={(e) => setSelectedTeacher(e.target.value)} // Actualizamos el estado con el valor seleccionado
        value={selectedTeacher} // El valor seleccionado es el username del profesor
      >
        <option value="">Selecciona un profesor</option>
        {teachers.map((teacher) => (
          // Mapeamos la lista de profesores y mostramos su nombre y username
          <option key={teacher.id} value={teacher.username}>
            {teacher.name} {teacher.surname} ({teacher.username})
          </option>
        ))}
      </select>
      <button onClick={assignCourse} disabled={!selectedTeacher}>
        Asignar Curso
      </button>
    </div>
  );
};

export default AssignCourse;
