import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FaUser, FaGraduationCap, FaInfoCircle, FaCalendarAlt, FaUsers, FaClock } from "react-icons/fa";
import { fetchWithAuth } from "../../../api/api";
import "./StudentCourseHeader.css";

const StudentCourseHeader = ({ courseId }) => {
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth(`/student/course/${courseId}`);
        setCourseInfo(data);
      } catch (error) {
        setError("Error al cargar la información del curso");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="course-header-loading">
        <Spinner animation="border" variant="primary" size="sm" />
        <span>Cargando información del curso...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-header-error">
        <FaInfoCircle />
        <span>{error}</span>
      </div>
    );
  }

  if (!courseInfo) {
    return (
      <div className="course-header-error">
        <FaInfoCircle />
        <span>No se pudo cargar la información del curso</span>
      </div>
    );
  }

  return (
    <div className="course-header-card">
      <div className="header-main">
        {/* Información principal del curso */}
        <div className="course-info">
          <div className="course-title-section">
            <div className="course-icon-wrapper">
              <FaGraduationCap className="course-icon" />
            </div>
            <div className="course-details">
              <h1 className="course-title">{courseInfo.name}</h1>
            </div>
          </div>
          
          {courseInfo.description && (
            <div className="course-description">
              <p>{courseInfo.description}</p>
            </div>
          )}

          {/* Información rápida compacta */}
          <div className="course-quick-info">
            {courseInfo.studentsCount && (
              <div className="info-card">
                <div className="info-card-icon">
                  <FaUsers />
                </div>
                <div className="info-card-content">
                  <span className="info-card-value">{courseInfo.studentsCount}</span>
                  <span className="info-card-label">Estudiantes</span>
                </div>
              </div>
            )}
            
            {courseInfo.startDate && (
              <div className="info-card">
                <div className="info-card-icon">
                  <FaCalendarAlt />
                </div>
                <div className="info-card-content">
                  <span className="info-card-value">
                    {new Date(courseInfo.startDate).toLocaleDateString('es-ES')}
                  </span>
                  <span className="info-card-label">Inicio</span>
                </div>
              </div>
            )}
            
            {courseInfo.endDate && (
              <div className="info-card">
                <div className="info-card-icon">
                  <FaClock />
                </div>
                <div className="info-card-content">
                  <span className="info-card-value">
                    {new Date(courseInfo.endDate).toLocaleDateString('es-ES')}
                  </span>
                  <span className="info-card-label">Fin</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información del profesor - compacta */}
        <div className="teacher-info">
          <div className="teacher-card">
            <div className="teacher-avatar">
              <FaUser />
            </div>
            <span className="teacher-label">Profesor</span>
            <h3 className="teacher-name">
              {courseInfo.teacherUsername || "No asignado"}
            </h3>
            {courseInfo.teacherEmail && (
              <p className="teacher-email">{courseInfo.teacherEmail}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseHeader;