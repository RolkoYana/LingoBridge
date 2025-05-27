import React, { useState, useEffect } from "react";
import { Row, Col, Dropdown, Badge } from "react-bootstrap";
import { 
  FaBell, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaCog, 
  FaChevronDown,
  FaTasks,
  FaClock,
  FaBook
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../api/api";

const StudentHeader = ({ name }) => {
  const [user, setUser] = useState({ name: "Student" });
  const navigate = useNavigate();
  const [completedCourses, setCompletedCourses] = useState(0);
  const [inProgressCourses, setInProgressCourses] = useState(0);
  const [notifications, setNotifications] = useState(2);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Estados para actividades
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error al parsear user:", e);
      }
    }
  }, []);

  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Cargar cursos del estudiante
  const loadStudentCourses = async () => {
    try {
      const courses = await fetchWithAuth("/student/courses");
      console.log("Cursos del estudiante:", courses);

      const completed = courses.filter(course => course.completed === true).length;
      const inProgress = courses.filter(course => course.completed === false).length;

      setCompletedCourses(completed);
      setInProgressCourses(inProgress);
    } catch (err) {
      console.error("Error al obtener los cursos del estudiante:", err);
    }
  };

  // Cargar actividades pendientes
  const loadActivities = async () => {
    try {
      setActivitiesLoading(true);
      const courses = await fetchWithAuth("/student/courses");
      
      if (!Array.isArray(courses)) {
        throw new Error("Error al obtener los cursos.");
      }

      const allActivities = [];

      for (const course of courses) {
        const courseActivities = await fetchWithAuth(
          `/student/course/${course.id}/activity`
        );

        if (Array.isArray(courseActivities)) {
          courseActivities.forEach((activity) => {
            allActivities.push({
              ...activity,
              courseName: course.name,
              courseId: course.id,
            });
          });
        }
      }

      const pending = allActivities
        .filter((a) => !a.completed)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5); // Solo las 5 más próximas

      setActivities(pending);
    } catch (err) {
      console.error("Error cargando actividades:", err);
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    loadStudentCourses();
    loadActivities();
  }, []);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const handleActivityClick = (activity) => {
    if (activity.completed) return;

    const { courseId, id: activityId, type } = activity;

    if (type === "TASK") {
      navigate(`/student/course/${courseId}/task/${activityId}`);
    } else if (type === "TEST") {
      navigate(`/student/course/${courseId}/test/${activityId}`);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatActivityDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <div className="student-header-integrated">
      {/* Fila única: Saludo + Widgets y Usuario */}
      <Row className="align-items-center">
        <Col>
          <div className="welcome-section">
            <h4 className="greeting-text mb-1">
              {getGreeting()}, <span className="user-name">{user?.name || "Estudiante"}</span>!
            </h4>
            <p className="date-text mb-0">
              {formatDate()}
            </p>
          </div>
        </Col>
        <Col xs="auto">
          <div className="user-actions d-flex align-items-center">
            
            {/* Widget de Actividades */}
            <div className="activities-widget me-3">
              <Dropdown align="end">
                <Dropdown.Toggle 
                  as="button"
                  className="activities-btn"
                  id="activities-dropdown"
                >
                  <FaTasks size={16} />
                  {activities.length > 0 && (
                    <Badge 
                      bg="warning" 
                      className="activities-badge"
                      pill
                    >
                      {activities.length > 9 ? '9+' : activities.length}
                    </Badge>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="activities-dropdown-menu">
                  <div className="dropdown-header">
                    <div className="d-flex align-items-center">
                      <FaTasks className="me-2" />
                      <div>
                        <div className="fw-bold">Próximas Actividades</div>
                        <small className="text-muted">
                          {activities.length} pendiente{activities.length !== 1 ? 's' : ''}
                        </small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="activities-list">
                    {activitiesLoading ? (
                      <div className="text-center p-3">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </div>
                    ) : activities.length === 0 ? (
                      <div className="text-center p-3 text-muted">
                        <FaTasks size={24} className="mb-2" />
                        <div>No hay actividades pendientes</div>
                      </div>
                    ) : (
                      activities.map((activity, index) => (
                        <div 
                          key={index}
                          className="activity-item"
                          onClick={() => handleActivityClick(activity)}
                        >
                          <div className="activity-info">
                            <div className="activity-title">{activity.title}</div>
                            <div className="activity-course">
                              <FaBook size={10} className="me-1" />
                              {activity.courseName}
                            </div>
                          </div>
                          <div className="activity-due">
                            <FaClock size={10} className="me-1" />
                            {formatActivityDate(activity.dueDate)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {activities.length > 0 && (
                    <div className="dropdown-footer">
                      <small className="text-muted">
                        Click en una actividad para acceder
                      </small>
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Notificaciones */}
            <div className="notification-container me-3">
              <button 
                className="notification-btn"
                aria-label={`${notifications} notificaciones pendientes`}
              >
                <FaBell size={18} />
                {notifications > 0 && (
                  <Badge 
                    bg="danger" 
                    className="notification-badge"
                    pill
                  >
                    {notifications > 9 ? '9+' : notifications}
                  </Badge>
                )}
              </button>
            </div>

            {/* Menú de usuario */}
            <Dropdown align="end" className="user-dropdown">
              <Dropdown.Toggle 
                as="div"
                className="user-menu-toggle"
                id="user-dropdown"
                role="button"
                tabIndex="0"
              >
                <div className="d-flex align-items-center">
                  <div className="user-avatar me-2">
                    <FaUserCircle size={32} />
                  </div>
                  <div className="user-info d-none d-md-block me-2">
                    <div className="user-name-small">{user?.name || "Estudiante"}</div>
                    <div className="user-role">Estudiante</div>
                  </div>
                  <FaChevronDown size={10} className="dropdown-arrow" />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-dropdown-menu">
                <div className="dropdown-header">
                  <div className="d-flex align-items-center">
                    <FaUserCircle size={24} className="me-2" />
                    <div>
                      <div className="fw-bold">{user?.name || "Estudiante"}</div>
                      <small className="text-muted">{user?.email || "estudiante@lingobridge.com"}</small>
                    </div>
                  </div>
                </div>
                
                <Dropdown.Divider />
                
                <Dropdown.Item className="dropdown-item-custom">
                  <FaCog className="me-2" />
                  Configuración
                </Dropdown.Item>
                
                <Dropdown.Item className="dropdown-item-custom">
                  <FaBell className="me-2" />
                  Notificaciones
                  {notifications > 0 && (
                    <Badge bg="danger" size="sm" className="ms-auto">
                      {notifications}
                    </Badge>
                  )}
                </Dropdown.Item>
                
                <Dropdown.Divider />
                
                <Dropdown.Item 
                  className="dropdown-item-logout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-2" />
                  Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StudentHeader;