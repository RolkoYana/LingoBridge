import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../api/api";
import "./StudentAvailableCourses.css";

const StudentAvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourses, setEnrollingCourses] = useState(new Set());

  const loadCourses = () => {
    setLoading(true);
    fetchWithAuth("/student/available-courses")
      .then((data) => {
        console.log("DEBUG - Datos recibidos:", data);
        setCourses(data);
      })
      .catch((err) => console.error("Error al cargar cursos:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const enrollInCourse = async (courseId) => {
    setEnrollingCourses(prev => new Set(prev).add(courseId));
    
    try {
      const data = await fetchWithAuth(`/student/enroll/${courseId}`, {
        method: "POST",
      });
      
      if (data) {
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseId)
        );
        
        alert("¡Inscripción exitosa! El curso se ha añadido a tus cursos.");
      } else {
        alert("Hubo un problema con la inscripción. Inténtalo de nuevo.");
      }
    } catch (err) {
      console.error("Error al inscribir en el curso:", err);
      alert("Error al inscribirse en el curso. Por favor, inténtalo más tarde.");
    } finally {
      setEnrollingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      'A1': '#28a745', 'A2': '#20c997',
      'B1': '#17a2b8', 'B2': '#007bff',
      'C1': '#6f42c1', 'C2': '#e83e8c'
    };
    return colors[level] || '#6c757d';
  };

  if (loading) {
    return (
      <div className="courses-container">
        <div className="courses-header">
          <h2 className="courses-title">Cursos Disponibles</h2>
          <p className="courses-subtitle">Cargando cursos disponibles...</p>
        </div>
        <div className="courses-loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2 className="courses-title">Cursos Disponibles</h2>
        <p className="courses-subtitle">
          {courses.length} curso{courses.length !== 1 ? 's' : ''} disponible{courses.length !== 1 ? 's' : ''} para inscripción
        </p>
      </div>

      <div className="courses-content">
        {courses.length === 0 ? (
          <div className="courses-empty">
            <div className="empty-icon">🎓</div>
            <h4 className="empty-title">No hay cursos disponibles</h4>
            <p className="empty-text">
              En este momento no hay cursos abiertos para inscripción. 
              Vuelve más tarde para ver nuevas oportunidades de aprendizaje.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="courses-table">
              <thead>
                <tr>
                  <th className="header-course">Curso</th>
                  <th className="header-teacher">Profesor</th>
                  <th className="header-type">Tipo</th>
                  <th className="header-action">Acción</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="course-row">
                    <td className="cell-course" data-label="Curso">
                      <div className="course-info">
                        <div className="course-title-container">
                          <span className="course-name">{course.name}</span>
                          {course.level && (
                            <span 
                              className="level-badge"
                              style={{ backgroundColor: getLevelColor(course.level) }}
                            >
                              {course.level}
                            </span>
                          )}
                        </div>
                        {course.description && (
                          <div className="course-description">{course.description}</div>
                        )}
                      </div>
                    </td>
                    
                    <td className="cell-teacher" data-label="Profesor">
                      <div className="teacher-info">
                        <div className="teacher-icon">👤</div>
                        <span className="teacher-name">
                          {course.teacher 
                            ? `${course.teacher.name} ${course.teacher.surname}`
                            : "Por asignar"
                          }
                        </span>
                      </div>
                    </td>
                    
                    <td className="cell-type" data-label="Tipo">
                      <span className={`type-badge type-${course.type.toLowerCase()}`}>
                        {course.type.charAt(0).toUpperCase() + course.type.slice(1)}
                      </span>
                    </td>
                    
                    <td className="cell-action" data-label="Acción">
                      <button
                        className={`btn-enroll ${enrollingCourses.has(course.id) ? 'btn-loading' : ''}`}
                        onClick={() => enrollInCourse(course.id)}
                        disabled={enrollingCourses.has(course.id)}
                      >
                        {enrollingCourses.has(course.id) ? (
                          <>
                            <span className="btn-spinner"></span>
                            Inscribiendo...
                          </>
                        ) : (
                          <>
                            <span className="btn-icon">📝</span>
                            Inscribirse
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAvailableCourses;