import React, { useState, useEffect } from "react";
import { Button, Row, Col, Badge } from "react-bootstrap";
import { FaBook, FaUser, FaPlay, FaCheck, FaClock } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";
import { useNavigate } from "react-router-dom";

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
      <div className="unified-section">
        <div className="section-header">
          <div className="d-flex align-items-center">
            <FaBook size={28} className="header-icon me-3" />
            <div>
              <h2 className="section-title">Mis Cursos</h2>
              <p className="section-subtitle">Cargando tus cursos...</p>
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
        <Row className="align-items-center">
          <Col>
            <div className="d-flex align-items-center">
              <FaBook size={28} className="header-icon me-3" />
              <div>
                <h2 className="section-title">Mis Cursos</h2>
                <p className="section-subtitle">
                  {myCourses.length} curso{myCourses.length !== 1 ? 's' : ''} inscrito{myCourses.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </Col>
          <Col xs="auto">
            <div className="course-stats-header d-flex gap-4">
              <div className="course-stat-item">
                <div className="stat-number text-success">{completedCourses.length}</div>
                <div className="stat-label">Completados</div>
              </div>
              <div className="course-stat-item">
                <div className="stat-number text-primary">{activeCourses.length}</div>
                <div className="stat-label">En progreso</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Contenido principal */}
      <div className="section-content p-4">
        {myCourses.length === 0 ? (
          <div className="empty-section">
            <FaBook size={64} className="empty-icon" />
            <h4 className="empty-title">No estás inscrito en ningún curso</h4>
            <p className="empty-text">
              Explora los cursos disponibles y comienza tu aprendizaje.
            </p>
          </div>
        ) : (
          <>
            {/* Cursos activos */}
            {activeCourses.length > 0 && (
              <div className="course-section mb-4">
                <div className="d-flex align-items-center mb-3">
                  <FaClock className="text-primary me-2" />
                  <h5 className="section-subtitle-small mb-0">
                    Cursos en progreso ({activeCourses.length})
                  </h5>
                </div>
                
                <Row>
                  {activeCourses.map((course) => (
                    <Col md={6} lg={4} key={course.id} className="mb-3">
                      <div className="course-card active">
                        <div className="course-header">
                          <h6 className="course-title">{course.name}</h6>
                          <Badge bg="success" className="status-badge">
                            <FaClock size={10} className="me-1" />
                            En progreso
                          </Badge>
                        </div>
                        
                        <div className="course-info">
                          <div className="teacher-info">
                            <FaUser size={12} className="me-1" />
                            <span>Profesor: {course.teacherUsername}</span>
                          </div>
                          <p className="course-description">{course.description}</p>
                        </div>
                        
                        <div className="course-actions">
                          <Button
                            className="btn-primary-custom w-100"
                            onClick={() => handleContinue(course.id)}
                          >
                            <FaPlay className="me-2" />
                            Acceder al Curso
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Cursos completados */}
            {completedCourses.length > 0 && (
              <div className="course-section">
                <div className="d-flex align-items-center mb-3">
                  <FaCheck className="text-success me-2" />
                  <h5 className="section-subtitle-small mb-0">
                    Cursos completados ({completedCourses.length})
                  </h5>
                </div>
                
                <Row>
                  {completedCourses.map((course) => (
                    <Col md={6} lg={4} key={course.id} className="mb-3">
                      <div className="course-card completed">
                        <div className="course-header">
                          <h6 className="course-title">{course.name}</h6>
                          <Badge bg="secondary" className="status-badge">
                            <FaCheck size={10} className="me-1" />
                            Completado
                          </Badge>
                        </div>
                        
                        <div className="course-info">
                          <div className="teacher-info">
                            <FaUser size={12} className="me-1" />
                            <span>Profesor: {course.teacherUsername}</span>
                          </div>
                          <p className="course-description">{course.description}</p>
                        </div>
                        
                        <div className="course-actions">
                          <Button
                            variant="outline-secondary"
                            className="w-100"
                            onClick={() => handleContinue(course.id)}
                          >
                            <FaBook className="me-2" />
                            Revisar Curso
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;