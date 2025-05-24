import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { fetchWithAuth } from "../../api/api";

const StudentEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const data = await fetchWithAuth("/student/activity-results");
        setEvaluations(data);
      } catch (error) {
        console.error("Error al cargar las evaluaciones:", error);
      }
    };

    fetchEvaluations();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">My Evaluations</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Actividad</th>
            <th>Curso</th>
            <th>Nota</th>
            <th>Comentario</th>
            <th>Fecha de entrega</th>
            <th>Profesor</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No hay evaluaciones disponibles.
              </td>
            </tr>
          ) : (
            evaluations.map((evalItem) => (
              <tr key={evalItem.activityResultId}>
                <td>{evalItem.activityTitle}</td>
                <td>{evalItem.courseName}</td>
                <td>{evalItem.score}</td>
                <td>{evalItem.feedback || "-"}</td>
                <td>{evalItem.completedAt}</td>
                <td>{evalItem.teacherName}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default StudentEvaluations;
