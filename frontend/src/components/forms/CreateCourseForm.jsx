import React, { useState } from "react";
import { Form, Button, Row, Col, Alert, Badge } from "react-bootstrap";
import { FaSave, FaBook, FaUsers, FaCalendarAlt, FaGraduationCap, FaTimes, FaInfoCircle } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";

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
    // Limpiar errores al escribir
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

      // Resetear formulario
      setCourse({
        name: "",
        description: "",
        level: "A1",
        type: "INTENSIVO",
        completedAt: "",
      });

      // Notificar éxito y cerrar
      onSuccess();
      
    } catch (error) {
      console.error("Error al crear el curso:", error);
      setErrorMessage("Hubo un error al crear el curso. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unified-section">
      {/* Header de la sección */}
      <div className="section-header">
        <Row className="align-items-center">
          <Col>
            <h2 className="section-title">
              <FaBook className="header-icon me-3" />
              Crear Nuevo Curso
            </h2>
            <p className="section-subtitle">
              Completa la información para crear un nuevo curso
            </p>
          </Col>
          <Col xs="auto">
            <Badge bg="info" className="px-3 py-2">
              <FaInfoCircle className="me-2" />
              Pendiente de aprobación
            </Badge>
          </Col>
        </Row>
      </div>

      {/* Contenido del formulario */}
      <div className="section-content">
        <div className="p-4">
          {errorMessage && (
            <Alert variant="danger" className="mb-4 d-flex align-items-center">
              <FaTimes className="me-2" />
              <div>
                <strong>Error:</strong> {errorMessage}
              </div>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Información básica */}
            <div className="form-section mb-4">
              <div className="form-section-header">
                <h5 className="form-section-title">
                  <FaBook className="text-primary me-2" />
                  Información del Curso
                </h5>
                <p className="form-section-subtitle">Datos básicos del curso</p>
              </div>
              
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      Nombre del curso <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej: Español Conversacional B1"
                      name="name"
                      value={course.name}
                      onChange={handleChange}
                      className="form-control-custom"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      Descripción <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Describe los objetivos, metodología y contenido del curso..."
                      name="description"
                      value={course.description}
                      onChange={handleChange}
                      className="form-control-custom"
                      maxLength={500}
                      required
                    />
                    <div className="form-text-custom">
                      {course.description.length}/500 caracteres
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Configuración del curso */}
            <div className="form-section mb-4">
              <div className="form-section-header">
                <h5 className="form-section-title">
                  <FaGraduationCap className="text-success me-2" />
                  Configuración Académica
                </h5>
                <p className="form-section-subtitle">Nivel y modalidad del curso</p>
              </div>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Nivel del curso</Form.Label>
                    <Form.Select
                      name="level"
                      value={course.level}
                      onChange={handleChange}
                      className="form-control-custom"
                    >
                      {levels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </Form.Select>
                    <div className="form-text-custom">
                      {levels.find(l => l.value === course.level)?.description}
                    </div>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Modalidad</Form.Label>
                    <Form.Select
                      name="type"
                      value={course.type}
                      onChange={handleChange}
                      className="form-control-custom"
                    >
                      {courseTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </Form.Select>
                    <div className="form-text-custom">
                      {courseTypes.find(t => t.value === course.type)?.description}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Configuración temporal */}
            <div className="form-section mb-4">
              <div className="form-section-header">
                <h5 className="form-section-title">
                  <FaCalendarAlt className="text-info me-2" />
                  Programación
                </h5>
                <p className="form-section-subtitle">Configuración temporal (opcional)</p>
              </div>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Fecha de finalización estimada</Form.Label>
                    <Form.Control
                      type="date"
                      name="completedAt"
                      value={course.completedAt}
                      onChange={handleChange}
                      className="form-control-custom"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <div className="form-text-custom">
                      Puedes modificar esta fecha más adelante
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Botones de acción */}
            <div className="form-actions">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => onSuccess()}
                disabled={loading}
                className="btn-secondary-custom"
              >
                <FaTimes className="me-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                className="btn-teacher-primary"
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
    </div>
  );
};

export default CreateCourseForm;