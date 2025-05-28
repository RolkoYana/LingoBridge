import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import StudentCourseHeader from "../components/student/course/StudentCourseHeader";
import StudentCourseMaterial from "../components/student/course/StudentCourseMaterial";
import StudentCourseActivities from "../components/student/course/StudentCourseActivities";
import StudentCourseSidebar from "../components/student/course/StudentCourseSidebar";
import "../styles/StudentCourse.css";

const StudentCoursePage = () => {
  const { id } = useParams();
  // Cambiar el estado por defecto a "activities" en lugar de "home"
  const [activeSection, setActiveSection] = useState("activities");

  // Función para renderizar el contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case "material":
        return (
          <div className="single-section-content">
            <div className="course-card material-card">
              <div className="card-header">
                <h3 className="card-title">📚 Material del Curso</h3>
                <p className="card-subtitle">Recursos y contenido disponible</p>
              </div>
              <div className="card-content">
                <StudentCourseMaterial courseId={id} />
              </div>
            </div>
          </div>
        );
      
      case "activities":
        return (
          <div className="single-section-content">
            <div className="course-card activities-card">
              <div className="card-header">
                <h3 className="card-title">✏️ Actividades</h3>
                <p className="card-subtitle">Tareas y evaluaciones pendientes</p>
              </div>
              <div className="card-content">
                <StudentCourseActivities courseId={id} />
              </div>
            </div>
          </div>
        );
      
      case "grades":
        return (
          <div className="single-section-content">
            <div className="course-card grades-card">
              <div className="card-header">
                <h3 className="card-title">📊 Calificaciones</h3>
                <p className="card-subtitle">Tus calificaciones y evaluaciones</p>
              </div>
              <div className="card-content">
                <div className="coming-soon">
                  <h5>Próximamente</h5>
                  <p>La sección de calificaciones estará disponible pronto.</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "progress":
        return (
          <div className="single-section-content">
            <div className="course-card progress-card">
              <div className="card-header">
                <h3 className="card-title">📈 Mi Progreso</h3>
                <p className="card-subtitle">Seguimiento de tu avance</p>
              </div>
              <div className="card-content">
                <div className="coming-soon">
                  <h5>Próximamente</h5>
                  <p>La sección de progreso estará disponible pronto.</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "messages":
        return (
          <div className="single-section-content">
            <div className="course-card messages-card">
              <div className="card-header">
                <h3 className="card-title">💬 Mensajes</h3>
                <p className="card-subtitle">Comunicación con el profesor</p>
              </div>
              <div className="card-content">
                <div className="coming-soon">
                  <h5>Próximamente</h5>
                  <p>La sección de mensajes estará disponible pronto.</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "home":
      default:
        return (
          <Row className="course-content-row">
            {/* Material del Curso */}
            <Col xs={12} lg={6} className="content-column">
              <div className="course-card material-card">
                <div className="card-header">
                  <h3 className="card-title">📚 Material del Curso</h3>
                  <p className="card-subtitle">Recursos y contenido disponible</p>
                </div>
                <div className="card-content">
                  <StudentCourseMaterial courseId={id} />
                </div>
              </div>
            </Col>

            {/* Actividades */}
            <Col xs={12} lg={6} className="content-column">
              <div className="course-card activities-card">
                <div className="card-header">
                  <h3 className="card-title">✏️ Actividades</h3>
                  <p className="card-subtitle">Tareas y evaluaciones pendientes</p>
                </div>
                <div className="card-content">
                  <StudentCourseActivities courseId={id} />
                </div>
              </div>
            </Col>
          </Row>
        );
    }
  };

  return (
    <div className="student-course-layout">
      {/* Sidebar */}
      <div className="course-sidebar">
        <StudentCourseSidebar 
          setActiveSection={setActiveSection}
          activeSection={activeSection}
        />
      </div>

      {/* Main Content */}
      <div className="course-main-content">
        {/* Header del curso */}
        <div className="course-header-section">
          <Container fluid>
            <StudentCourseHeader courseId={id} />
          </Container>
        </div>

        {/* Contenido principal */}
        <div className="course-body">
          <Container fluid>
            {renderContent()}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursePage;