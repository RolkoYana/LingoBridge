import React, { useState } from 'react';
import { Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { 
  FaEnvelope, 
  FaInbox, 
  FaPaperPlane, 
  FaUser,
  FaClock,
  FaUserTie
} from 'react-icons/fa';

const StudentMessages = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  
  // Datos simulados para mostrar el diseño
  const mockMessages = [
    {
      id: 1,
      from: 'Pilar Martínez',
      fromType: 'teacher',
      subject: 'Feedback sobre tu tarea de vocabulario',
      preview: 'Hola Carlos, he revisado tu tarea y me gustaría comentarte...',
      time: '14:30',
      unread: true
    },
    {
      id: 2,
      from: 'Alex Johnson',
      fromType: 'teacher', 
      subject: 'Recordatorio: Examen próximo lunes',
      preview: 'Recuerda que el lunes tenemos el examen de gramática...',
      time: 'Ayer',
      unread: true
    },
    {
      id: 3,
      from: 'Soporte LingoBridge',
      fromType: 'admin',
      subject: 'Bienvenido a tu curso de inglés',
      preview: 'Te damos la bienvenida a tu nuevo curso...',
      time: '3 días',
      unread: false
    }
  ];

  const mockTeachers = [
    { username: 'pilarmartinez', name: 'Pilar Martínez', course: 'Español Nivel B1' },
    { username: 'alexjohnson', name: 'Alex Johnson', course: 'Inglés Nivel A1' }
  ];

  return (
    <div className="unified-section">
      {/* Header */}
      <div className="section-header">
        <Row className="align-items-center">
          <Col>
            <div className="d-flex align-items-center">
              <FaEnvelope size={28} className="header-icon me-3" />
              <div>
                <h2 className="section-title">Mensajes</h2>
                <p className="section-subtitle">
                  Comunícate con tus profesores
                </p>
              </div>
            </div>
          </Col>
          <Col xs="auto">
            <div className="messages-stats-header d-flex gap-4">
              <div className="message-stat-item">
                <div className="stat-number text-warning">{mockMessages.filter(m => m.unread).length}</div>
                <div className="stat-label">Sin leer</div>
              </div>
              <div className="message-stat-item">
                <div className="stat-number text-primary">{mockMessages.length}</div>
                <div className="stat-label">Total</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="section-content p-4">
        {/* Tabs de navegación */}
        <Row className="mb-4">
          <Col>
            <div className="message-tabs">
              <button 
                className={`tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
                onClick={() => setActiveTab('inbox')}
              >
                <FaInbox className="me-2" />
                Bandeja de entrada
                <Badge bg="warning" className="ms-2">
                  {mockMessages.filter(m => m.unread).length}
                </Badge>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'compose' ? 'active' : ''}`}
                onClick={() => setActiveTab('compose')}
              >
                <FaPaperPlane className="me-2" />
                Nuevo mensaje
              </button>
            </div>
          </Col>
        </Row>

        {/* Contenido según tab activo */}
        {activeTab === 'inbox' ? (
          <div className="messages-list">
            {mockMessages.length > 0 ? (
              mockMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`student-message-item ${message.unread ? 'unread' : ''}`}
                >
                  <div className="message-content">
                    <div className="message-header">
                      <div className="sender-info">
                        <div className="sender-avatar">
                          {message.fromType === 'teacher' ? <FaUserTie /> : <FaUser />}
                        </div>
                        <div className="sender-details">
                          <h6 className="sender-name">
                            {message.from}
                            {message.fromType === 'teacher' && (
                              <Badge bg="primary" size="sm" className="ms-2">Profesor</Badge>
                            )}
                          </h6>
                          <p className="message-subject">{message.subject}</p>
                        </div>
                      </div>
                      <div className="message-meta">
                        <span className="message-time">
                          <FaClock size={12} className="me-1" />
                          {message.time}
                        </span>
                        {message.unread && (
                          <Badge bg="warning" className="unread-badge">
                            Nuevo
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="message-preview">
                      {message.preview}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-messages text-center py-5">
                <FaInbox size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No hay mensajes</h5>
                <p className="text-muted">Los mensajes de tus profesores aparecerán aquí</p>
              </div>
            )}
          </div>
        ) : (
          <div className="compose-message">
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Para (Profesor)</Form.Label>
                    <Form.Select className="modern-select">
                      <option value="">Seleccionar profesor...</option>
                      {mockTeachers.map((teacher) => (
                        <option key={teacher.username} value={teacher.username}>
                          {teacher.name} - {teacher.course}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Asunto</Form.Label>
                    <Form.Control 
                      type="text"
                      placeholder="Escribe el asunto del mensaje..."
                      className="modern-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-4">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  placeholder="Escribe tu consulta o mensaje aquí..."
                  className="modern-input"
                />
              </Form.Group>
              
              <div className="compose-actions">
                <Button variant="outline-secondary" className="me-2">
                  Cancelar
                </Button>
                <Button className="btn-primary-custom">
                  <FaPaperPlane className="me-2" />
                  Enviar Mensaje
                </Button>
              </div>
            </Form>
          </div>
        )}

        {/* Estado de "próximamente" */}
        <div className="coming-soon-notice mt-4 p-3 text-center">
          <small className="text-muted">
            💡 <strong>Funcionalidad en desarrollo:</strong> La mensajería completa estará disponible pronto
          </small>
        </div>
      </div>
    </div>
  );
};

export default StudentMessages;