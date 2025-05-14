import React, {useEffect, useState} from 'react'
import {Table} from "react-bootstrap"
import { fetchWithAuth } from '../../api/api'

const AllCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await fetchWithAuth("/admin/all-courses");
        setCourses(data);
      } catch (error) {
        console.error("Error al cargar todos los cursos:", error.message);
      }
    };

    fetchCourses();
  }, []);

  const getEstadoCurso = (course) => {
    if (!course.approved) return "Pendiente de aprobar";
    if (course.completed) return "Finalizado";
    return "Activo";
  };

  return (
    <div className="mt-4">
      <h5>Todos los cursos</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Modalidad</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td>{course.type}</td>
              <td>{getEstadoCurso(course)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AllCourses