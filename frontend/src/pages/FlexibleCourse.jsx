import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Smartphone,
  Target,
  Calendar,
  RotateCcw,
  BarChart3,
  MessageCircle,
  Headphones,
  Trophy,
} from "lucide-react";

const FlexibleCourse = () => {
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate("/");
  };

  const handleInscribirse = (plan) => {
    navigate("/register");
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
      }}
    >
      {/* Header */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top"
        style={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.95) !important",
        }}
      >
        <div className="container">
          <span className="navbar-brand fw-bold text-info fs-3 mb-0">
            🌍 Idiomas Online
          </span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#">
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#">
                  Cursos
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#">
                  Profesores
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#">
                  Contacto
                </a>
              </li>
            </ul>

            <button
              onClick={handleVolver}
              className="btn btn-info rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <ArrowLeft size={18} />
              Volver
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        {/* Hero Section */}
        <section
          className="bg-white rounded-4 p-4 p-md-5 mb-5 shadow-lg"
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <div className="text-center">
            <span
              className="badge bg-gradient text-white px-4 py-2 rounded-pill fs-6 fw-bold mb-4"
              style={{ background: "linear-gradient(45deg, #00b894, #00cec9)" }}
            >
              🕐 CURSO FLEXIBLE
            </span>
            <h1
              className="display-3 fw-bold mb-4"
              style={{
                background: "linear-gradient(45deg, #74b9ff, #0984e3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Aprende a Tu Ritmo
            </h1>
            <p
              className="lead text-muted mb-0 mx-auto"
              style={{ maxWidth: "600px" }}
            >
              Diseñado para personas ocupadas que quieren aprender sin
              comprometer su rutina diaria. Tú decides cuándo y cómo estudiar.
            </p>
          </div>
        </section>

        {/* Flexibility Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div
              className="card h-100 border-0 shadow-sm"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
            >
              <div className="card-body p-4 text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(45deg, #00b894, #00cec9)",
                  }}
                >
                  <Clock className="text-white" size={32} />
                </div>
                <h5 className="card-title fw-bold mb-3">Horarios Flexibles</h5>
                <p className="card-text text-muted">
                  Clases disponibles desde las 6:00 AM hasta las 11:00 PM.
                  Reserva y cancela con 2 horas de anticipación.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card h-100 border-0 shadow-sm"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
            >
              <div className="card-body p-4 text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(45deg, #00b894, #00cec9)",
                  }}
                >
                  <Smartphone className="text-white" size={32} />
                </div>
                <h5 className="card-title fw-bold mb-3">
                  Múltiples Plataformas
                </h5>
                <p className="card-text text-muted">
                  Accede desde cualquier dispositivo: móvil, tablet o
                  computadora. Tu progreso se sincroniza automáticamente.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card h-100 border-0 shadow-sm"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
            >
              <div className="card-body p-4 text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(45deg, #00b894, #00cec9)",
                  }}
                >
                  <Target className="text-white" size={32} />
                </div>
                <h5 className="card-title fw-bold mb-3">Ritmo Personalizado</h5>
                <p className="card-text text-muted">
                  Define tu propio ritmo de aprendizaje. Intensifica cuando
                  tengas tiempo, relájate cuando estés ocupado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Options */}
        <section
          className="bg-white rounded-4 p-4 p-md-5 mb-5 shadow-lg"
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <h2 className="text-center fw-bold mb-5 display-6">
            Opciones de Horarios
          </h2>

          <div className="row g-4">
            <div className="col-lg-4">
              <div
                className="text-center p-4 rounded-3 text-white shadow h-100"
                style={{
                  background:
                    "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
                }}
              >
                <h3 className="fw-bold mb-3">Matutino</h3>
                <p className="mb-4">
                  Perfecto para madrugar y empezar el día aprendiendo
                </p>
                <span className="badge bg-light text-dark px-4 py-2 rounded-pill fw-bold">
                  6:00 - 9:00 AM
                </span>
              </div>
            </div>

            <div className="col-lg-4">
              <div
                className="text-center p-4 rounded-3 text-white shadow h-100"
                style={{
                  background:
                    "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
                }}
              >
                <h3 className="fw-bold mb-3">Vespertino</h3>
                <p className="mb-4">
                  Ideal para la pausa del almuerzo o después del trabajo
                </p>
                <span className="badge bg-light text-dark px-4 py-2 rounded-pill fw-bold">
                  12:00 - 8:00 PM
                </span>
              </div>
            </div>

            <div className="col-lg-4">
              <div
                className="text-center p-4 rounded-3 text-white shadow h-100"
                style={{
                  background:
                    "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
                }}
              >
                <h3 className="fw-bold mb-3">Nocturno</h3>
                <p className="mb-4">
                  Para los noctámbulos que prefieren estudiar de noche
                </p>
                <span className="badge bg-light text-dark px-4 py-2 rounded-pill fw-bold">
                  8:00 - 11:00 PM
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          className="bg-white rounded-4 p-4 p-md-5 mb-5 shadow-lg"
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <h2 className="text-center fw-bold mb-5 display-6">
            ¿Qué hace único a nuestro curso flexible?
          </h2>

          <div className="row g-3">
            {[
              {
                icon: <Calendar size={24} />,
                text: "Reserva clases hasta con 15 minutos de anticipación",
              },
              {
                icon: <RotateCcw size={24} />,
                text: "Cambia profesores según tu preferencia y disponibilidad",
              },
              {
                icon: <BarChart3 size={24} />,
                text: "Seguimiento personalizado de tu progreso y metas",
              },
              {
                icon: <MessageCircle size={24} />,
                text: "Chat 24/7 con tutores para dudas rápidas",
              },
              {
                icon: <Headphones size={24} />,
                text: "Biblioteca de recursos multimedia disponible siempre",
              },
              {
                icon: <Trophy size={24} />,
                text: "Sistema de logros y recompensas por consistencia",
              },
            ].map((feature, index) => (
              <div key={index} className="col-md-6">
                <div
                  className="d-flex align-items-center p-3 rounded-3 text-white shadow"
                  style={{
                    background:
                      "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)",
                  }}
                >
                  <div className="me-3 flex-shrink-0">{feature.icon}</div>
                  <span>{feature.text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div
              className="bg-white rounded-3 p-4 shadow text-center h-100"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <blockquote className="blockquote">
                <p className="fs-6 fst-italic text-muted mb-3">
                  "Como madre trabajadora, este curso flexible me ha permitido
                  estudiar inglés sin descuidar mis responsabilidades.
                  ¡Perfecto!"
                </p>
                <footer className="blockquote-footer">
                  <strong className="text-info">Ana Martínez</strong>, Contadora
                </footer>
              </blockquote>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className="bg-white rounded-3 p-4 shadow text-center h-100"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <blockquote className="blockquote">
                <p className="fs-6 fst-italic text-muted mb-3">
                  "Viajo mucho por trabajo y poder tomar clases desde cualquier
                  lugar ha sido un cambio de vida. Muy recomendado."
                </p>
                <footer className="blockquote-footer">
                  <strong className="text-info">Carlos Ruiz</strong>, Consultor
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlexibleCourse;
