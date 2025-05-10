import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../api/api";

const AssignCourse = ({courseId}) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  // obtener lista de profesores disponibles
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await fetchWithAuth("/teachers"); // endpoint que devuelve la lista de profesores
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
        "assign-course/${courseId}?teacherUsername=${selectedTeacher}",
        { method: "POST" }
      );
      alert(response.message);
    } catch (error) {
      alert("Error al asignar curso");
    }
  };

  return (
    <div>
      <h3>Asignar Curso a Profesor</h3>
      <select onChange={(e) => setSelectedTeacher(e.target.value)}>
        <option value="">Selecciona un profesor</option>
        {teachers.map((teacher) => (
          <option key={teacher.username} value={teacher.username}>
            {teacher.username}
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
