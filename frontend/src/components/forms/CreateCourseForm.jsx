import React, { useState } from "react";
import { Form, Button, Row, Col, Alert, Badge } from "react-bootstrap";
import { FaSave, FaBook, FaCalendarAlt, FaGraduationCap, FaTimes, FaInfoCircle } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";
import "./CreateCourseForm.css";

const CreateCourseForm = ({ onSuccess }) => {
  const [course, setCourse] = useState({
    name: "",
    description: "",
    level: "A1",
    type: "INTENSIVO",
    completedAt: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const levels = [
    { value: "A1", label: "A1 - Principiante", description: "Nivel básico inicial" },
    { value: "A2", label: "A2 - Elemental", description: "Nivel básico avanzado" },
    { value: "B1", label: "B1 - Intermedio", description: "Nivel intermedio inicial" },
    { value: "B2", label: "B2 - Intermedio Alto", description: "Nivel intermedio avanzado" },
    { value: "C1", label: "C1 - Avanzado", description: "Nivel avanzado" },
    { value: "C2", label: "C2 - Experto", description: "Nivel de dominio" }
  ];

  const courseTypes = [
    { 
      value: "INTENSIVO", 
      label: "Intensivo", 
      description: "Clases frecuentes, progreso rápido",
      icon: "⚡"
    },
    { 
      value: "GRUPAL", 
      label: "Grupal", 
      description: "Aprendizaje en grupo, interacción social",
      icon: "👥"
    },
    { 
      value: "FLEXIBLE", 
      label: "Flexible", 
      description: "Horarios adaptables, ritmo personalizado",
      icon: "🔄"
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
    if (errorMessage) setErrorMessage(null);
  };

  const validateForm = () => {
    if (!course.name.trim()) {
      setErrorMessage("El nombre del curso es obligatorio");
      return false;
    }
    if (course.name.length < 3) {
      setErrorMessage("El nombre debe tener al menos 3 caracteres");
      return false;
    }
    if (!course.description.trim()) {
      setErrorMessage("La descripción es obligatoria");
      return false;
    }
    if (course.description.length < 10) {
      setErrorMessage("La descripción debe tener al menos 10 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
      setErrorMessage("No se encontró el usuario autenticado.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const courseToSend = {
      ...course,
      approved: false,
      completed: false,
    };

    try {
      await fetchWithAuth(
        `/teacher/create-course?teacherUsername=${user.username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseToSend),
        }
      );

      setCourse({
        name: "",
        description: "",
        level: "A1",
        type: "INTENSIVO",
        completedAt: "",
      });

      onSuccess();
      
    } catch (error) {
      console.error("Error al crear el curso:", error);
      setErrorMessage("Hubo un error al crear el curso. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simple-form-container">
      {/* Header simple */}
      <div className="simple-header">
        <div className="header-content">
          <div className="header-left">
            <FaBook className="header-icon" />
            <div>
              <h2 className="form-title">Información del Curso</h2>
              <p className="form-subtitle">Completa los datos para crear tu nuevo curso</p>
            </div>
          </div>
          <Badge bg="info" className="status-badge">
            <FaInfoCircle className="me-2" />
            Pendiente de aprobación
          </Badge>
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="simple-content">
        {errorMessage && (
          <Alert variant="danger" className="mb-4">
            <FaTimes className="me-2" />
            <strong>Error:</strong> {errorMessage}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Información básica */}
          <div className="form-group-section">
            <h5 className="section-title-clean">
              <FaBook className="me-2" />
              Información del Curso
            </h5>
            
            <Form.Group className="mb-3">
              <Form.Label>Nombre del curso <span className="required">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Español Conversacional B1"
                name="name"
                value={course.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción <span className="required">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe los objetivos, metodología y contenido del curso..."
                name="description"
                value={course.description}
                onChange={handleChange}
                maxLength={500}
                required
              />
              <div className="char-count">{course.description.length}/500 caracteres</div>
            </Form.Group>
          </div>

          {/* Configuración del curso */}
          <div className="form-group-section">
            <h5 className="section-title-clean">
              <FaGraduationCap className="me-2" />
              Configuración Académica
            </h5>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nivel del curso</Form.Label>
                  <Form.Select
                    name="level"
                    value={course.level}
                    onChange={handleChange}
                  >
                    {levels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </Form.Select>
                  <div className="help-text">
                    {levels.find(l => l.value === course.level)?.description}
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Modalidad</Form.Label>
                  <Form.Select
                    name="type"
                    value={course.type}
                    onChange={handleChange}
                  >
                    {courseTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </Form.Select>
                  <div className="help-text">
                    {courseTypes.find(t => t.value === course.type)?.description}
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Programación */}
          <div className="form-group-section">
            <h5 className="section-title-clean">
              <FaCalendarAlt className="me-2" />
              Programación
            </h5>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de finalización estimada</Form.Label>
                  <Form.Control
                    type="date"
                    name="completedAt"
                    value={course.completedAt}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <div className="help-text">Puedes modificar esta fecha más adelante</div>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Botones */}
          <div className="form-buttons">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => onSuccess()}
              disabled={loading}
            >
              <FaTimes className="me-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creando curso...
                </>
              ) : (
                <>
                  <FaSave className="me-2" />
                  Crear Curso
                </>
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateCourseForm;