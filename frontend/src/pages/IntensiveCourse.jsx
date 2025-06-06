import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, User, BookOpen, Clock, Users, Star, CheckCircle } from 'lucide-react';

const IntensiveCourse = () => {
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate('/');
  };

  const handleInscribirse = () => {
    navigate('/register');
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95) !important' }}>
        <div className="container">
          <span className="navbar-brand fw-bold text-primary fs-3 mb-0">
            🌍 Idiomas Online
          </span>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#">Cursos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#">Profesores</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#">Contacto</a>
              </li>
            </ul>
            
            <button 
              onClick={handleVolver}
              className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <ArrowLeft size={18} />
              Volver
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        {/* Hero Section */}
        <section className="bg-white rounded-4 p-4 p-md-5 mb-5 shadow-lg" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <div className="text-center">
            <span className="badge bg-gradient text-white px-4 py-2 rounded-pill fs-6 fw-bold mb-4" 
                  style={{ background: 'linear-gradient(45deg, #dc3545, #fd7e14)' }}>
              🚀 CURSO INTENSIVO
            </span>
            <h1 className="display-3 fw-bold mb-4" style={{ 
              background: 'linear-gradient(45deg, #667eea, #764ba2)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Domina un Idioma en Tiempo Récord
            </h1>
            <p className="lead text-muted mb-0 mx-auto" style={{ maxWidth: '600px' }}>
              Programa acelerado de inmersión total para profesionales que necesitan resultados rápidos y efectivos
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <div className="card-body p-4 text-center">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                     style={{ width: '80px', height: '80px', background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                  <Zap className="text-white" size={32} />
                </div>
                <h5 className="card-title fw-bold mb-3">Aprendizaje Acelerado</h5>
                <p className="card-text text-muted">
                  Metodología intensiva diseñada para maximizar tu progreso en el menor tiempo posible, con técnicas probadas de inmersión lingüística.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <div className="card-body p-4 text-center">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                     style={{ width: '80px', height: '80px', background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                  <User className="text-white" size={32} />
                </div>
                <h5 className="card-title fw-bold mb-3">Profesores Nativos</h5>
                <p className="card-text text-muted">
                  Clases exclusivas con profesores nativos especializados en enseñanza intensiva y certificados en metodologías avanzadas.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <div className="card-body p-4 text-center">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                     style={{ width: '80px', height: '80px', background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                  <BookOpen className="text-white" size={32} />
                </div>
                <h5 className="card-title fw-bold mb-3">Material Personalizado</h5>
                <p className="card-text text-muted">
                  Contenido adaptado a tu nivel y objetivos específicos, con ejercicios prácticos y situaciones reales de comunicación.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <section className="bg-white rounded-4 p-4 p-md-5 mb-5 shadow-lg" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <h2 className="text-center fw-bold mb-5 display-6">Detalles del Programa</h2>
          
          <div className="row g-4 mb-5">
            {[
              { number: "4", label: "Semanas de Duración", icon: <Clock size={24} /> },
              { number: "20", label: "Horas por Semana", icon: <BookOpen size={24} /> },
              { number: "5", label: "Días a la Semana", icon: <Star size={24} /> },
              { number: "1-3", label: "Estudiantes por Clase", icon: <Users size={24} /> }
            ].map((item, index) => (
              <div key={index} className="col-6 col-lg-3">
                <div className="text-center p-4 rounded-3 text-white shadow" 
                     style={{ background: 'linear-gradient(135deg, #e91e63, #f44336)' }}>
                  <div className="mb-2">{item.icon}</div>
                  <div className="display-4 fw-bold mb-2">{item.number}</div>
                  <div className="small">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="fw-bold mb-4 h4">¿Qué incluye?</h3>
            <div className="row g-3">
              {[
                "Clases presenciales y virtuales",
                "Material didáctico premium", 
                "Evaluaciones semanales",
                "Certificado internacional",
                "Soporte 24/7",
                "Práctica conversacional diaria"
              ].map((item, index) => (
                <div key={index} className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded-3" style={{ borderLeft: '4px solid #667eea' }}>
                    <CheckCircle className="text-primary me-3 flex-shrink-0" size={20} />
                    <span>{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <div className="bg-white rounded-3 p-4 p-md-5 mb-5 shadow text-center" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <blockquote className="blockquote">
            <p className="fs-5 fst-italic text-muted mb-4">
              "En solo 4 semanas logré el nivel que necesitaba para mi trabajo. El método intensivo realmente funciona y los profesores son excepcionales."
            </p>
            <footer className="blockquote-footer">
              <strong className="text-primary">María González</strong>, Ejecutiva Internacional
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default IntensiveCourse;