import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { FaBook, FaUsers, FaGraduationCap } from "react-icons/fa";
import "./TeacherCourseHeader.css";

const TeacherCourseHeader = ({ course }) => {
  if (!course) {
    return (
      <div className="course-header-error">
        <p>Error al cargar la información del curso</p>
      </div>
    );
  }

  return (
    <div className="teacher-course-header">
      <Row className="align-items-center">
        <Col xs={12} md={8}>
          <div className="course-main-info">
            <div className="course-title-section">
              <FaGraduationCap className="course-icon" />
              <div>
                <h1 className="course-title">{course.name}</h1>
                <p className="course-description">{course.description}</p>
              </div>
            </div>
          </div>
        </Col>
        
        <Col xs={12} md={4}>
          <div className="course-stats">
            <div className="stat-item">
              <div className="stat-icon users">
                <FaUsers />
              </div>
              <div className="stat-content">
                <div className="stat-number">{course.numberOfStudents || 0}</div>
                <div className="stat-label">Estudiantes</div>
              </div>
            </div>
            
            <div className="course-badges">
              <Badge bg="primary" className="type-badge">
                {course.type}
              </Badge>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherCourseHeader;