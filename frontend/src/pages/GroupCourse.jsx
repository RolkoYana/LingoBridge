import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, HandHeart, Drama, Trophy, MessageSquare, Palette, FileText, Sparkles, Star } from 'lucide-react';

const GroupCourse = () => {
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate('/');
  };

  const handleInscribirse = (plan) => {
    navigate('/register');
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)' }}>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95) !important' }}>
        <div className="container">
          <span className="navbar-brand fw-bold text-pink fs-3 mb-0" style={{ color: '#e84393' }}>
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
              className="btn rounded-pill px-4 d-flex align-items-center gap-2 text-white"
              style={{ backgroundColor: '#e84393' }}
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
                  style={{ background: 'linear-gradient(45deg, #e17055, #d63031)' }}>
              👥 CURSO GRUPAL
            </span>
            <h1 className="display-3 fw-bold mb-4" style={{ 
              background: 'linear-gradient(45deg, #fd79a8, #fdcb6e)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Aprende Junto a Otros
            </h1>
            <p className="lead text-muted mb-0 mx-auto" style={{ maxWidth: '700px' }}>
              La experiencia más enriquecedora: comparte, practica y motívate junto a compañeros de tu mismo nivel. El aprendizaje colaborativo acelera tu progreso.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <div className="card-body p-4 text-center">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                     style={{ width: '80px', height: '80px', background: 'linear-gradient(45deg, #fd79a8, #fdcb6e)' }}>
                  <HandHeart className="text-white" size={32} />
                </div>
                <h5 className="card-title fw-bold mb-3">Interacción Real</h5>
                <p className="card-text text-muted">
                  Practica conversaciones naturales con compañeros de clase, simulando situaciones reales de comunicación en el idioma.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <div className="card-body p-4 text-center">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                     style={{ width: '80px', height: '80px', background: 'linear-gradient(45deg, #fd79a8, #fdcb6e)' }}>
                  <Sparkles className="text-white" size={32} />
                </div>
                <h5 className="card-title fw-bold mb-3">Motivación Grupal</h5>
                <p className="card-text text-muted">
                  El ambiente de grupo genera motivación adicional. Los compañeros te animan a seguir y celebran tus logros contigo.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <div className="card-body p-4 text-center">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                     style={{ width: '80px', height: '80px', background: 'linear-gradient(45deg, #fd79a8, #fdcb6e)' }}>
                  <DollarSign className="text-white" size={32} />
                </div>
                <h5 className="card-title fw-bold mb-3">Mejor Precio</h5>
                <p className="card-text text-muted">
                  La opción más económica sin sacrificar calidad. Ideal para estudiantes y familias que buscan un excelente valor.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Group Sizes */}
        <section className="bg-white rounded-4 p-4 p-md-5 mb-5 shadow-lg" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <h2 className="text-center fw-bold mb-5 display-6">Tamaños de Grupo Perfectos</h2>
          
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="text-center p-4 rounded-3 text-white shadow h-100" 
                   style={{ background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)' }}>
                <div className="display-3 fw-bold mb-3">4-6</div>
                <h3 className="fw-bold mb-3">Grupo Pequeño</h3>
                <p className="mb-0">Atención personalizada con la dinámica perfecta para practicar conversación y recibir feedback detallado.</p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="text-center p-4 rounded-3 text-white shadow h-100" 
                   style={{ background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)' }}>
                <div className="display-3 fw-bold mb-3">7-10</div>
                <h3 className="fw-bold mb-3">Grupo Estándar</h3>
                <p className="mb-0">El equilibrio ideal entre interacción grupal y participación individual. Más diversidad de perspectivas.</p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="text-center p-4 rounded-3 text-white shadow h-100" 
                   style={{ background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)' }}>
                <div className="display-3 fw-bold mb-3">11-15</div>
                <h3 className="fw-bold mb-3">Grupo Grande</h3>
                <p className="mb-0">Ambiente dinámico con múltiples compañeros de práctica. Perfecto para desarrollar confianza al hablar.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="bg-white rounded-4 p-4 p-md-5 mb-5 shadow-lg" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <h2 className="text-center fw-bold mb-5 display-6">Nuestra Metodología Grupal</h2>
          
          <div className="row g-3">
            {[
              { icon: <Drama size={24} />, text: "Role-playing y dramatizaciones interactivas" },
              { icon: <Trophy size={24} />, text: "Competencias amigables y juegos educativos" },
              { icon: <MessageSquare size={24} />, text: "Debates estructurados sobre temas de interés" },
              { icon: <Palette size={24} />, text: "Proyectos colaborativos y presentaciones" },
              { icon: <FileText size={24} />, text: "Corrección entre pares supervisada" },
              { icon: <Star size={24} />, text: "Celebración grupal de logros y progresos" }
            ].map((method, index) => (
              <div key={index} className="col-md-6">
                <div className="d-flex align-items-center p-3 rounded-3 text-white shadow" 
                     style={{ background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)' }}>
                  <div className="me-3 flex-shrink-0">{method.icon}</div>
                  <span>{method.text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Stats */}
        <section className="text-white rounded-4 p-4 p-md-5 mb-5 text-center shadow-lg position-relative overflow-hidden" 
                 style={{ background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)' }}>
          <h2 className="fw-bold mb-4 display-6">Únete a Nuestra Comunidad</h2>
          <p className="fs-4 mb-5 opacity-75">
            Miles de estudiantes han encontrado no solo un nuevo idioma, sino también amistades duraderas
          </p>
          
          <div className="row g-4">
            {[
              { number: "2,847", label: "Estudiantes Activos" },
              { number: "156", label: "Grupos Formados" },
              { number: "98%", label: "Satisfacción" },
              { number: "4.9", label: "Valoración Promedio" }
            ].map((stat, index) => (
              <div key={index} className="col-6 col-lg-3">
                <div className="p-4 rounded-3" style={{ 
                  backdropFilter: 'blur(10px)', 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div className="display-5 fw-bold mb-2">{stat.number}</div>
                  <div className="small">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="bg-white rounded-3 p-4 shadow text-center h-100" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <blockquote className="blockquote">
                <p className="fs-6 fst-italic text-muted mb-3">
                  "El grupo se ha convertido en mi segunda familia. Hemos creado un chat de WhatsApp donde practicamos todos los días. ¡Increíble!"
                </p>
                <footer className="blockquote-footer">
                  <strong style={{ color: '#e84393' }}>Laura Fernández</strong>
                  <br />
                  <small className="text-muted">Estudiante de Inglés B2</small>
                </footer>
              </blockquote>
            </div>
          </div>

          <div className="col-md-6">
            <div className="bg-white rounded-3 p-4 shadow text-center h-100" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <blockquote className="blockquote">
                <p className="fs-6 fst-italic text-muted mb-3">
                  "Al principio tenía miedo de hablar, pero mis compañeros me dieron mucha confianza. Ahora soy el más hablador del grupo."
                </p>
                <footer className="blockquote-footer">
                  <strong style={{ color: '#e84393' }}>Miguel Santos</strong>
                  <br />
                  <small className="text-muted">Estudiante de Francés A2</small>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCourse;