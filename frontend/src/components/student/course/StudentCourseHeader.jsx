import React, { useEffect, useState } from "react";
import { Spinner, Badge } from "react-bootstrap";
import { FaUser, FaGraduationCap, FaInfoCircle, FaCalendarAlt } from "react-icons/fa";
import { fetchWithAuth } from "../../../api/api";

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
        console.error("Error al cargar los datos del curso:", error);
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

  const getModalityBadge = (modality) => {
    if (!modality) return { variant: "secondary", text: "Sin definir" };
    
    const modalityLower = modality.toLowerCase();
    if (modalityLower.includes("intensiv")) {
      return { variant: "warning", text: "INTENSIVO" };
    } else if (modalityLower.includes("grup") || modalityLower.includes("group")) {
      return { variant: "info", text: "GRUPAL" };
    } else if (modalityLower.includes("flex")) {
      return { variant: "success", text: "FLEXIBLE" };
    } else {
      return { variant: "primary", text: modality.toUpperCase() };
    }
  };

  const modalityInfo = getModalityBadge(courseInfo.modality);

  return (
    <div className="course-header-card">
      <div className="header-main">
        <div className="course-info">
          <div className="course-title-section">
            <div className="course-icon-wrapper">
              <FaGraduationCap className="course-icon" />
            </div>
            <div className="course-details">
              <h1 className="course-title">{courseInfo.name}</h1>
              <div className="course-badges">
                <Badge bg={modalityInfo.variant} className="modality-badge">
                  {modalityInfo.text}
                </Badge>
                <Badge bg="outline-secondary" className="id-badge">
                  ID: {courseId}
                </Badge>
              </div>
            </div>
          </div>
          
          {courseInfo.description && (
            <div className="course-description">
              <p>{courseInfo.description}</p>
            </div>
          )}
        </div>

        <div className="teacher-info">
          <div className="teacher-card">
            <div className="teacher-avatar">
              <FaUser />
            </div>
            <div className="teacher-details">
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

      {/* Información adicional */}
      {(courseInfo.startDate || courseInfo.endDate || courseInfo.studentsCount) && (
        <div className="header-footer">
          <div className="additional-info">
            {courseInfo.startDate && (
              <div className="info-item">
                <FaCalendarAlt className="info-icon" />
                <span className="info-label">Inicio:</span>
                <span className="info-value">{courseInfo.startDate}</span>
              </div>
            )}
            {courseInfo.endDate && (
              <div className="info-item">
                <FaCalendarAlt className="info-icon" />
                <span className="info-label">Fin:</span>
                <span className="info-value">{courseInfo.endDate}</span>
              </div>
            )}
            {courseInfo.studentsCount && (
              <div className="info-item">
                <FaUser className="info-icon" />
                <span className="info-label">Estudiantes:</span>
                <span className="info-value">{courseInfo.studentsCount}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourseHeader;