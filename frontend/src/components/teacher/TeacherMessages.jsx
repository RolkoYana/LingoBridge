import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { 
  FaEnvelope, 
  FaInbox, 
  FaPaperPlane, 
  FaUser,
  FaClock
} from 'react-icons/fa';
import "./TeacherMessages.css";

const TeacherMessages = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  
  // Datos simulados para mostrar el diseño
  const mockMessages = [
    {
      id: 1,
      from: 'Carlos Fernández',
      subject: 'Consulta sobre la tarea de gramática',
      preview: 'Hola profesor, tengo una duda sobre el ejercicio 3...',
      time: '10:30',
      unread: true
    },
    {
      id: 2,
      from: 'Clara Weber',
      subject: 'Solicitud de tutoría',
      preview: 'Me gustaría programar una sesión adicional...',
      time: 'Ayer',
      unread: true
    },
    {
      id: 3,
      from: 'José Pérez',
      subject: 'Gracias por la clase',
      preview: 'Muchas gracias por la explicación de hoy...',
      time: '2 días',
      unread: false
    }
  ];

  return (
    <Card className="content-card p-4">
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <FaEnvelope size={24} className="text-primary me-3" />
            <div>
              <h3 className="mb-1">Mensajes</h3>
              <p className="text-muted mb-0">
                {mockMessages.filter(m => m.unread).length} mensaje{mockMessages.filter(m => m.unread).length !== 1 ? 's' : ''} sin leer
              </p>
            </div>
          </div>
        </Col>
      </Row>

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
              <Badge bg="primary" className="ms-2">
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
                className={`message-item ${message.unread ? 'unread' : ''}`}
              >
                <div className="message-content">
                  <div className="message-header">
                    <div className="sender-info">
                      <div className="sender-avatar">
                        <FaUser />
                      </div>
                      <div className="sender-details">
                        <h6 className="sender-name">{message.from}</h6>
                        <p className="message-subject">{message.subject}</p>
                      </div>
                    </div>
                    <div className="message-meta">
                      <span className="message-time">
                        <FaClock size={12} className="me-1" />
                        {message.time}
                      </span>
                      {message.unread && (
                        <Badge bg="primary" className="unread-badge">
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
              <p className="text-muted">Los mensajes de tus estudiantes aparecerán aquí</p>
            </div>
          )}
        </div>
      ) : (
        <div className="compose-message">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Para (Estudiante)</Form.Label>
                  <Form.Select className="modern-select">
                    <option value="">Seleccionar estudiante...</option>
                    <option value="carlos">Carlos Fernández</option>
                    <option value="clara">Clara Weber</option>
                    <option value="jose">José Pérez</option>
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
                placeholder="Escribe tu mensaje aquí..."
                className="modern-input"
              />
            </Form.Group>
            
            <div className="compose-actions">
              <Button variant="outline-secondary" className="me-2">
                Cancelar
              </Button>
              <Button className="btn-create-course">
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
    </Card>
  );
};

export default TeacherMessages;