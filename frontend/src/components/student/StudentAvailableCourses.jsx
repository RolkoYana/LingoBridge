import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { fetchWithAuth } from "../../api/api";
import "./StudentAvailableCourses.css";

const StudentAvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourses, setEnrollingCourses] = useState(new Set());
  const [alert, setAlert] = useState(null);

  // Función para mostrar alertas bonitas
  const showAlert = (type, title, message) => {
    console.log("Mostrando alerta:", { type, title, message });
    setAlert({ type, title, message });
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  // Interceptar TODAS las alertas nativas
  useEffect(() => {
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    
    // Sobrescribir alert nativo
    window.alert = (message) => {
      console.log("Alert nativo interceptado:", message);
      showAlert('info', 'Notificación', message);
      return undefined;
    };
    
    // Sobrescribir confirm nativo (opcional)
    window.confirm = (message) => {
      console.log("Confirm nativo interceptado:", message);
      showAlert('warning', 'Confirmación', message);
      return true; // Siempre devolver true para no bloquear
    };
    
    return () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
    };
  }, []);

  const loadCourses = () => {
    setLoading(true);
    fetchWithAuth("/student/available-courses")
      .then((data) => {
        console.log("DEBUG - Datos recibidos:", data);
        setCourses(data);
      })
      .catch((err) => {
        console.error("Error al cargar cursos:", err);
        showAlert('danger', 'Error al cargar', 'No se pudieron cargar los cursos disponibles.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
    
    // Prevenir alerts nativos de errores no capturados
    const handleError = (event) => {
      console.log("Error global capturado:", event.error);
      showAlert('danger', 'Error', event.error?.message || 'Ha ocurrido un error inesperado');
      event.preventDefault();
      return false;
    };
    
    const handleUnhandledRejection = (event) => {
      console.log("Promise rejection capturada:", event.reason);
      showAlert('danger', 'Error', event.reason?.message || 'Error en operación asíncrona');
      event.preventDefault();
      return false;
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Función de inscripción mejorada con mejor manejo de errores
  const enrollInCourse = async (courseId) => {
    console.log("Iniciando inscripción para curso:", courseId);
    setEnrollingCourses(prev => new Set(prev).add(courseId));
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      console.log("Enviando petición de inscripción...");
      
      const response = await fetch(`http://localhost:8080/api/student/enroll/${courseId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Respuesta recibida:", response.status, response.statusText);

      if (response.ok) {
        // Manejar respuesta exitosa
        let data = null;
        try {
          const text = await response.text();
          if (text) {
            data = JSON.parse(text);
          }
        } catch (parseError) {
          console.log("Respuesta no es JSON válido, pero inscripción exitosa");
        }

        console.log("Inscripción exitosa, datos:", data);

        const enrolledCourse = courses.find(course => course.id === courseId);
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseId)
        );
        
        // USAR NUESTRA ALERTA BONITA en lugar de alert nativo
        showAlert(
          'success',
          '¡Inscripción exitosa!',
          `Te has inscrito correctamente en el curso "${enrolledCourse?.name || 'seleccionado'}". El curso se ha añadido a tus cursos.`
        );
        
      } else {
        // Manejar errores HTTP
        let errorMessage = 'Hubo un problema con la inscripción.';
        
        try {
          const errorText = await response.text();
          console.log("Error del servidor:", errorText);
          
          // Intentar parsear el error del servidor
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            // Si no es JSON, usar mensajes predeterminados según status
            if (response.status === 400) {
              errorMessage = 'Ya estás inscrito en este curso o no cumples los requisitos.';
            } else if (response.status === 401) {
              errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
            } else if (response.status === 403) {
              errorMessage = 'No tienes permisos para inscribirte en este curso.';
            } else if (response.status === 404) {
              errorMessage = 'El curso no existe o ya no está disponible.';
            } else if (response.status >= 500) {
              errorMessage = 'Error del servidor. Inténtalo más tarde.';
            }
          }
        } catch (textError) {
          console.log("No se pudo leer el error del servidor");
        }
        
        // USAR NUESTRA ALERTA BONITA
        showAlert('danger', 'Error de inscripción', errorMessage);
      }
      
    } catch (networkError) {
      console.error("Error de red capturado:", networkError);
      
      // USAR NUESTRA ALERTA BONITA
      showAlert(
        'danger',
        'Error de conexión',
        networkError.message || 'No se pudo conectar con el servidor. Verifica tu conexión.'
      );
      
    } finally {
      setEnrollingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      'A1': '#28a745', 'A2': '#20c997',
      'B1': '#17a2b8', 'B2': '#007bff',
      'C1': '#6f42c1', 'C2': '#e83e8c'
    };
    return colors[level] || '#6c757d';
  };

  // Función para cerrar alerta manualmente
  const closeAlert = () => {
    setAlert(null);
  };

  if (loading) {
    return (
      <div className="courses-container">
        <div className="courses-header">
          <h2 className="courses-title">Cursos Disponibles</h2>
          <p className="courses-subtitle">Cargando cursos disponibles...</p>
        </div>
        <div className="courses-loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      {/* Alert bonito de Bootstrap - Mejorado */}
      {alert && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 9999, 
          width: '90%', 
          maxWidth: '500px' 
        }}>
          <Alert 
            variant={alert.type}
            onClose={closeAlert}
            dismissible
            className="custom-alert"
          >
            <Alert.Heading className="alert-title">
              {alert.type === 'success' && '✅ '}
              {alert.type === 'warning' && '⚠️ '}
              {alert.type === 'danger' && '❌ '}
              {alert.type === 'info' && 'ℹ️ '}
              {alert.title}
            </Alert.Heading>
            <p className="alert-message">
              {alert.message}
            </p>
          </Alert>
        </div>
      )}

      <div className="courses-header">
        <h2 className="courses-title">Cursos Disponibles</h2>
        <p className="courses-subtitle">
          {courses.length} curso{courses.length !== 1 ? 's' : ''} disponible{courses.length !== 1 ? 's' : ''} para inscripción
        </p>
      </div>

      <div className="courses-content">
        {courses.length === 0 ? (
          <div className="courses-empty">
            <div className="empty-icon">🎓</div>
            <h4 className="empty-title">No hay cursos disponibles</h4>
            <p className="empty-text">
              En este momento no hay cursos abiertos para inscripción. 
              Vuelve más tarde para ver nuevas oportunidades de aprendizaje.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="courses-table">
              <thead>
                <tr>
                  <th className="header-course">Curso</th>
                  <th className="header-teacher">Profesor</th>
                  <th className="header-type">Tipo</th>
                  <th className="header-action">Acción</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="course-row">
                    <td className="cell-course" data-label="Curso">
                      <div className="course-info">
                        <div className="course-title-container">
                          <span className="course-name">{course.name}</span>
                          {course.level && (
                            <span 
                              className="level-badge"
                              style={{ backgroundColor: getLevelColor(course.level) }}
                            >
                              {course.level}
                            </span>
                          )}
                        </div>
                        {course.description && (
                          <div className="course-description">{course.description}</div>
                        )}
                      </div>
                    </td>
                    
                    <td className="cell-teacher" data-label="Profesor">
                      <div className="teacher-info">
                        <div className="teacher-icon">👤</div>
                        <span className="teacher-name">
                          {course.teacher 
                            ? `${course.teacher.name} ${course.teacher.surname}`
                            : "Por asignar"
                          }
                        </span>
                      </div>
                    </td>
                    
                    <td className="cell-type" data-label="Tipo">
                      <span className={`type-badge type-${course.type.toLowerCase()}`}>
                        {course.type.charAt(0).toUpperCase() + course.type.slice(1)}
                      </span>
                    </td>
                    
                    <td className="cell-action" data-label="Acción">
                      <button
                        className={`btn-enroll ${enrollingCourses.has(course.id) ? 'btn-loading' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          enrollInCourse(course.id);
                        }}
                        disabled={enrollingCourses.has(course.id)}
                        type="button"
                      >
                        {enrollingCourses.has(course.id) ? (
                          <>
                            <span className="btn-spinner"></span>
                            Inscribiendo...
                          </>
                        ) : (
                          <>
                            <span className="btn-icon">📝</span>
                            Inscribirse
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAvailableCourses;