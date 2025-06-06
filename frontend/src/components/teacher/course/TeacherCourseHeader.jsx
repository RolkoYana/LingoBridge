import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { FaUsers, FaGraduationCap } from "react-icons/fa";
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
    <div className="teacher-course-header-inline">
      <Row className="align-items-center">
        <Col xs={12} lg={8}>
          <div className="course-main-info-inline">
            <FaGraduationCap className="course-icon-inline" />
            <div className="course-text-content">
              <h1 className="course-title-inline">{course.name}</h1>
              <p className="course-description-inline">{course.description}</p>
            </div>
          </div>
        </Col>
        
        <Col xs={12} lg={4}>
          <div className="course-stats-inline">
            <div className="stat-item-inline">
              <FaUsers className="stat-icon-inline" />
              <div className="stat-content-inline">
                <span className="stat-number-inline">{course.numberOfStudents || 0}</span>
                <span className="stat-label-inline">Estudiantes</span>
              </div>
            </div>
            
            <Badge bg="primary" className="type-badge-inline">
              {course.type}
            </Badge>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherCourseHeader;