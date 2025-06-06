import React, { useState, useEffect } from "react";
import { Button, Badge } from "react-bootstrap";
import { FaBook, FaUser, FaPlay, FaCheck, FaClock } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./StudentCourses.css";

const StudentCourses = () => {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await fetchWithAuth("/student/courses");
        setMyCourses(data);
      } catch (error) {
        console.error("Error cargando cursos del estudiante:", error);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  const handleContinue = (courseId) => {
    navigate(`/student/course/${courseId}`);
  };

  const activeCourses = myCourses.filter((course) => !course.completed);
  const completedCourses = myCourses.filter((course) => course.completed);

  if (loading) {
    return (
      <div className="courses-container">
        <div className="courses-header">
          <h2 className="courses-title">Mis Cursos</h2>
          <p className="courses-subtitle">Cargando tus cursos...</p>
        </div>
        <div className="courses-loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      {/* Header con estadísticas */}
      <div className="courses-header">
        <div className="header-main">
          <div className="header-info">
            <FaBook size={28} className="header-icon" />
            <div>
              <h2 className="courses-title">Mis Cursos</h2>
              <p className="courses-subtitle">
                {myCourses.length} curso{myCourses.length !== 1 ? 's' : ''} inscrito{myCourses.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="course-stats">
            <div className="stat-item">
              <div className="stat-number completed">{completedCourses.length}</div>
              <div className="stat-label">Completados</div>
            </div>
            <div className="stat-item">
              <div className="stat-number active">{activeCourses.length}</div>
              <div className="stat-label">En progreso</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="courses-content">
        {myCourses.length === 0 ? (
          <div className="courses-empty">
            <div className="empty-icon">📚</div>
            <h4 className="empty-title">No estás inscrito en ningún curso</h4>
            <p className="empty-text">
              Explora los cursos disponibles y comienza tu aprendizaje.
            </p>
          </div>
        ) : (
          <>
            {/* Cursos en progreso */}
            {activeCourses.length > 0 && (
              <div className="course-section">
                <div className="section-header">
                  <FaClock className="section-icon active" />
                  <h3 className="section-title">
                    Cursos en progreso ({activeCourses.length})
                  </h3>
                </div>
                
                <div className="courses-list">
                  {activeCourses.map((course) => (
                    <div key={course.id} className="course-item active">
                      <div className="course-info">
                        <div className="course-main">
                          <h4 className="course-name">{course.name}</h4>
                          <p className="course-description">{course.description}</p>
                        </div>
                        <div className="course-meta">
                          <div className="teacher-info">
                            <FaUser size={14} className="teacher-icon" />
                            <span className="teacher-name">Prof. {course.teacherUsername}</span>
                          </div>
                          <Badge bg="success" className="status-badge">
                            En progreso
                          </Badge>
                        </div>
                      </div>
                      <div className="course-actions">
                        <Button
                          className="btn-access"
                          onClick={() => handleContinue(course.id)}
                        >
                          <FaPlay className="btn-icon" />
                          Acceder al Curso
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cursos completados */}
            {completedCourses.length > 0 && (
              <div className="course-section">
                <div className="section-header">
                  <FaCheck className="section-icon completed" />
                  <h3 className="section-title">
                    Cursos completados ({completedCourses.length})
                  </h3>
                </div>
                
                <div className="courses-list">
                  {completedCourses.map((course) => (
                    <div key={course.id} className="course-item completed">
                      <div className="course-info">
                        <div className="course-main">
                          <h4 className="course-name">{course.name}</h4>
                          <p className="course-description">{course.description}</p>
                        </div>
                        <div className="course-meta">
                          <div className="teacher-info">
                            <FaUser size={14} className="teacher-icon" />
                            <span className="teacher-name">Prof. {course.teacherUsername}</span>
                          </div>
                          <Badge bg="secondary" className="status-badge">
                            Completado
                          </Badge>
                        </div>
                      </div>
                      <div className="course-actions">
                        <Button
                          variant="outline-secondary"
                          className="btn-review"
                          onClick={() => handleContinue(course.id)}
                        >
                          <FaBook className="btn-icon" />
                          Revisar Curso
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;