import React, { useEffect, useState } from "react";
import { Button, Row, Col, Badge } from "react-bootstrap";
import { FaSearch, FaUserPlus, FaUser, FaGraduationCap, FaCheck } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourses, setEnrollingCourses] = useState(new Set());

  // cargar cursos disponibles
  const loadCourses = () => {
    setLoading(true);
    fetchWithAuth("/student/available-courses")
      .then((data) => {
        setCourses(data);
      })
      .catch((err) => console.error("Error al cargar cursos:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // inscribirse en un curso
  const enrollInCourse = async (courseId) => {
    setEnrollingCourses(prev => new Set(prev).add(courseId));
    
    try {
      const data = await fetchWithAuth(`/student/enroll/${courseId}`, {
        method: "POST",
      });
      
      if (data) {
        // Eliminar curso de la lista (ya no está disponible)
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseId)
        );
        
        // Mostrar mensaje de éxito más elegante
        // Aquí podrías usar una librería de toast notifications
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

  const getTypeVariant = (type) => {
    switch (type.toUpperCase()) {
      case 'INTENSIVO': return 'warning';
      case 'GRUPAL': return 'info';
      case 'FLEXIBLE': return 'success';
      default: return 'secondary';
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
      <div className="unified-section">
        <div className="section-header">
          <div className="d-flex align-items-center">
            <FaSearch size={28} className="header-icon me-3" />
            <div>
              <h2 className="section-title">Cursos Disponibles</h2>
              <p className="section-subtitle">Cargando cursos disponibles...</p>
            </div>
          </div>
        </div>
        <div className="section-content">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="unified-section">
      {/* Header integrado */}
      <div className="section-header">
        <div className="d-flex align-items-center">
          <FaSearch size={28} className="header-icon me-3" />
          <div>
            <h2 className="section-title">Cursos Disponibles</h2>
            <p className="section-subtitle">
              {courses.length} curso{courses.length !== 1 ? 's' : ''} disponible{courses.length !== 1 ? 's' : ''} para inscripción
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="section-content p-4">
        {courses.length === 0 ? (
          <div className="empty-section">
            <FaGraduationCap size={64} className="empty-icon" />
            <h4 className="empty-title">No hay cursos disponibles</h4>
            <p className="empty-text">
              En este momento no hay cursos abiertos para inscripción. 
              Vuelve más tarde para ver nuevas oportunidades de aprendizaje.
            </p>
          </div>
        ) : (
          <Row>
            {courses.map((course) => (
              <Col md={6} lg={4} key={course.id} className="mb-4">
                <div className="available-course-card">
                  <div className="course-header">
                    <div className="course-title-section">
                      <h5 className="course-title">{course.name}</h5>
                      <div className="course-badges">
                        {course.level && (
                          <Badge 
                            style={{ backgroundColor: getLevelColor(course.level) }}
                            className="level-badge me-2"
                          >
                            {course.level}
                          </Badge>
                        )}
                        <Badge bg={getTypeVariant(course.type)} className="type-badge">
                          {course.type.charAt(0).toUpperCase() + course.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="course-info">
                    <p className="course-description">{course.description}</p>
                    
                    <div className="teacher-info">
                      <FaUser size={14} className="me-2 text-muted" />
                      <span className="teacher-name">
                        {course.teacher
                          ? `${course.teacher.name} ${course.teacher.surname}`
                          : "Profesor por asignar"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="course-actions">
                    <Button
                      className="btn-enroll w-100"
                      onClick={() => enrollInCourse(course.id)}
                      disabled={enrollingCourses.has(course.id)}
                    >
                      {enrollingCourses.has(course.id) ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Inscribiendo...
                        </>
                      ) : (
                        <>
                          <FaUserPlus className="me-2" />
                          Inscribirse
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default AvailableCourses;