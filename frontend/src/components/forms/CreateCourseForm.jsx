import React, { useState } from "react";
import { Form, Button, Row, Col, Alert, InputGroup } from "react-bootstrap";
import { FaSave, FaBook, FaUsers, FaCalendarAlt, FaGraduationCap } from "react-icons/fa";
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
    <div className="create-course-form">
      {errorMessage && (
        <Alert variant="danger" className="d-flex align-items-center">
          <div>
            <strong>Error:</strong> {errorMessage}
          </div>
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Información básica */}
        <div className="form-section mb-4">
          <h6 className="form-section-title d-flex align-items-center mb-3">
            <FaBook className="text-primary me-2" />
            Información del Curso
          </h6>
          
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Nombre del curso <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Español Conversacional B1"
                  name="name"
                  value={course.name}
                  onChange={handleChange}
                  className="modern-input"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Descripción <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Describe los objetivos, metodología y contenido del curso..."
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                  className="modern-input"
                  required
                />
                <Form.Text className="text-muted">
                  {course.description.length}/500 caracteres
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Configuración del curso */}
        <div className="form-section mb-4">
          <h6 className="form-section-title d-flex align-items-center mb-3">
            <FaGraduationCap className="text-success me-2" />
            Configuración Académica
          </h6>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Nivel del curso</Form.Label>
                <Form.Select
                  name="level"
                  value={course.level}
                  onChange={handleChange}
                  className="modern-select"
                >
                  {levels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  {levels.find(l => l.value === course.level)?.description}
                </Form.Text>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Modalidad</Form.Label>
                <Form.Select
                  name="type"
                  value={course.type}
                  onChange={handleChange}
                  className="modern-select"
                >
                  {courseTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  {courseTypes.find(t => t.value === course.type)?.description}
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Configuración temporal */}
        <div className="form-section mb-4">
          <h6 className="form-section-title d-flex align-items-center mb-3">
            <FaCalendarAlt className="text-info me-2" />
            Programación (Opcional)
          </h6>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Fecha de finalización estimada</Form.Label>
                <Form.Control
                  type="date"
                  name="completedAt"
                  value={course.completedAt}
                  onChange={handleChange}
                  className="modern-input"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Form.Text className="text-muted">
                  Puedes modificar esta fecha más adelante
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Botones de acción */}
        <div className="d-flex justify-content-end gap-2 pt-3 border-top">
          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => onSuccess()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-create-course"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creando...
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
  );
};

export default CreateCourseForm;