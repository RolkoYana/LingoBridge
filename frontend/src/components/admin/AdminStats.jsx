import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import {
  FaUsers,
  FaBook,
  FaChartLine,
  FaGraduationCap,
  FaSync,
  FaArrowUp,
  FaArrowDown,
  FaPlay,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaChalkboardTeacher,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";
import "./AdminStats.css";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getShortTitle = (title, maxLength = 15) => {
    if (!title) return "datos";
    return title.length > maxLength
      ? title.substring(0, maxLength) + "..."
      : title.toLowerCase();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth("/admin/statistics");
      setStats(data);
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);

      if (error.message.includes("401")) {
        setError(
          "No tienes permisos para acceder a estas estadísticas. Contacta con el administrador."
        );
      } else if (error.message.includes("403")) {
        setError("Acceso denegado. Se requieren permisos de administrador.");
      } else {
        setError("Error al cargar las estadísticas. Verifica tu conexión.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Crear gráfica de donut
  const createDonutChart = (data, colors, title) => {
    if (!stats || !stats.languages || !data || data.length === 0) {
      return (
        <div className="donut-chart-container">
          <div className="donut-center">
            <div className="donut-percentage">0</div>
            <div className="donut-label-simple">Sin datos</div>
          </div>
        </div>
      );
    }

    const total = data.reduce((sum, value) => sum + value, 0);

    if (total === 0) {
      return (
        <div className="donut-chart-container">
          <div className="donut-center">
            <div className="donut-percentage">0</div>
            <div className="donut-label">Sin {getShortTitle(title)}</div>
          </div>
        </div>
      );
    }

    const radius = 80;
    const strokeWidth = 25;
    const normalizedRadius = radius - strokeWidth * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;

    // Crear segmentos
    let cumulativePercentage = 0;
    const segments = data.map((value, index) => {
      const percentage = (value / total) * 100;
      const strokeDasharray = `${
        (percentage / 100) * circumference
      } ${circumference}`;
      const strokeDashoffset = -((cumulativePercentage / 100) * circumference);

      const segment = {
        strokeDasharray,
        strokeDashoffset,
        color: colors[index % colors.length],
        percentage: percentage.toFixed(1),
        value,
        language: stats.languages[index],
      };

      cumulativePercentage += percentage;
      return segment;
    });

    return (
      <div
        className="donut-chart-container"
        title={`Total de ${title}: ${total}`}
      >
        <svg className="donut-chart-svg" width={radius * 2} height={radius * 2}>
          {/* Círculo base */}
          <circle
            stroke="#e2e8f0"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Segmentos */}
          {segments.map(
            (segment, index) =>
              segment.value > 0 && (
                <circle
                  key={index}
                  className="donut-segment"
                  stroke={segment.color}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={segment.strokeDasharray}
                  strokeDashoffset={segment.strokeDashoffset}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  transform={`rotate(-90 ${radius} ${radius})`}
                  strokeLinecap="round"
                  title={`${segment.language}: ${segment.value} (${segment.percentage}%)`}
                />
              )
          )}
        </svg>

        <div className="donut-center">
          <div className="donut-percentage">{total}</div>
          <div className="donut-label-simple">{title}</div>
        </div>
      </div>
    );
  };

  // Función para crear gráfica de barras
  const createBarChart = (data, color, title) => {
    if (!stats || !stats.languages || !data || data.length === 0) {
      return (
        <div className="bar-chart-container">
          <div className="text-center text-muted">
            No hay datos disponibles para {title.toLowerCase()}
          </div>
        </div>
      );
    }

    const maxValue = Math.max(...data);

    if (maxValue === 0) {
      return (
        <div className="bar-chart-container">
          <div className="text-center text-muted">
            No hay {title.toLowerCase()} registrados
          </div>
        </div>
      );
    }

    return (
      <div className="bar-chart-container">
        <div className="language-bars-wrapper single-metric">
          {stats.languages.map((language, index) => {
            const value = data[index] || 0;
            const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;

            return (
              <div key={index} className="language-bar-group">
                <div className="single-bar-container">
                  <div
                    className="language-bar single-bar"
                    style={{
                      height: `${heightPercent}%`,
                      background: `linear-gradient(to top, ${color}, ${color}cc)`,
                    }}
                    data-value={value}
                    title={`${language}: ${value} ${title.toLowerCase()}`}
                  />
                </div>
                <div className="language-bar-label">{language}</div>
                <div className="language-bar-value">{value}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner animation="border" variant="primary" size="lg" />
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <FaExclamationTriangle size={48} className="text-warning mb-3" />
        <Alert variant="warning" className="text-center">
          <Alert.Heading>Acceso Restringido</Alert.Heading>
          <p className="mb-0">{error}</p>
        </Alert>
        {!error.includes("permisos") && (
          <Button
            variant="outline-primary"
            onClick={fetchStats}
            className="mt-3"
          >
            <FaSync className="me-2" />
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  // Calcular total de usuarios
  const totalUsers = (stats?.totalTeachers || 0) + (stats?.totalStudents || 0);

  // Calcular cursos activos (total - completados - pendientes)
  const activeCourses =
    (stats?.totalCourses || 0) -
    (stats?.completedCourses || 0) -
    (stats?.pendingCourses || 0);

  // Colores para las gráficas
  const coursesColors = ["#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"];
  const teachersColors = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];
  const studentsColors = ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a"];

  return (
    <div className="dashboard-container">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h4>
            <FaChartLine className="me-2" />
            Panel de Estadísticas
          </h4>
          <p>Resumen general del sistema</p>
        </div>
        <Button
          variant="outline-primary"
          onClick={fetchStats}
          className="refresh-btn"
          disabled={loading}
        >
          <FaSync className={loading ? "fa-spin" : ""} />
        </Button>
      </div>

      {/* Tarjetas principales de estadísticas */}
      <Row className="mb-4">
        <Col xl={3} lg={6} md={6} sm={6} xs={12} className="mb-3">
          <Card className="dashboard-card-mini dashboard-card-blue h-100">
            <Card.Body className="p-3">
              <div className="mini-card-content">
                <div className="mini-card-icon dashboard-icon-blue">
                  <FaUsers />
                </div>
                <div className="mini-card-info">
                  <h3 className="mini-card-value">{totalUsers}</h3>
                  <p className="mini-card-label">Total Usuarios</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} md={6} sm={6} xs={12} className="mb-3">
          <Card className="dashboard-card-mini dashboard-card-success h-100">
            <Card.Body className="p-3">
              <div className="mini-card-content">
                <div className="mini-card-icon dashboard-icon-success">
                  <FaBook />
                </div>
                <div className="mini-card-info">
                  <h3 className="mini-card-value">
                    {stats?.totalCourses || 0}
                  </h3>
                  <p className="mini-card-label">Total Cursos</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} md={6} sm={6} xs={12} className="mb-3">
          <Card className="dashboard-card-mini dashboard-card-warning h-100">
            <Card.Body className="p-3">
              <div className="mini-card-content">
                <div className="mini-card-icon dashboard-icon-warning">
                  <FaGraduationCap />
                </div>
                <div className="mini-card-info">
                  <h3 className="mini-card-value">
                    {stats?.totalStudents || 0}
                  </h3>
                  <p className="mini-card-label">Total Estudiantes</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} md={6} sm={6} xs={12} className="mb-3">
          <Card className="dashboard-card-mini dashboard-card-info h-100">
            <Card.Body className="p-3">
              <div className="mini-card-content">
                <div className="mini-card-icon dashboard-icon-info">
                  <FaChalkboardTeacher />
                </div>
                <div className="mini-card-info">
                  <h3 className="mini-card-value">
                    {stats?.totalTeachers || 0}
                  </h3>
                  <p className="mini-card-label">Total Profesores</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tarjetas de estado de cursos */}
      <Row className="mb-4">
        <Col lg={4} md={6} sm={12} className="mb-3">
          <Card className="dashboard-card-status status-active h-100">
            <Card.Body className="p-3">
              <div className="status-card-content">
                <div className="status-info">
                  <h4 className="status-value">{Math.max(0, activeCourses)}</h4>
                  <p className="status-label">Cursos Activos</p>
                  <div className="status-trend">
                    <FaArrowUp className="trend-up" />
                    En progreso
                  </div>
                </div>
                <div className="status-icon">
                  <FaPlay />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} sm={12} className="mb-3">
          <Card className="dashboard-card-status status-completed h-100">
            <Card.Body className="p-3">
              <div className="status-card-content">
                <div className="status-info">
                  <h4 className="status-value">
                    {stats?.completedCourses || 0}
                  </h4>
                  <p className="status-label">Cursos Completados</p>
                  <div className="status-trend">
                    <FaArrowUp className="trend-up" />
                    Finalizados
                  </div>
                </div>
                <div className="status-icon">
                  <FaCheckCircle />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} sm={12} className="mb-3">
          <Card className="dashboard-card-status status-pending h-100">
            <Card.Body className="p-3">
              <div className="status-card-content">
                <div className="status-info">
                  <h4 className="status-value">{stats?.pendingCourses || 0}</h4>
                  <p className="status-label">Cursos Pendientes</p>
                  <div className="status-trend">
                    <FaClock className="trend-down" />
                    En espera
                  </div>
                </div>
                <div className="status-icon">
                  <FaClock />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* LAS TRES GRÁFICAS PRINCIPALES */}

      {/* 1. GRÁFICA DE CURSOS POR IDIOMA */}
      <Row className="mb-4">
        <Col lg={4} md={12} className="mb-4">
          <Card className="dashboard-card chart-card h-100">
            <div className="chart-card-header">
              <h6>
                <FaBook className="me-2" />
                Cursos por Idioma
              </h6>
            </div>
            <Card.Body>
              {createDonutChart(
                stats?.coursesPerLanguage,
                coursesColors,
                "Cursos"
              )}
              <div className="chart-legend">
                {stats?.languages?.map((language, index) => (
                  <div key={index} className="legend-item">
                    <div
                      className="legend-color"
                      style={{
                        backgroundColor:
                          coursesColors[index % coursesColors.length],
                      }}
                    />
                    <span className="legend-text">
                      {language} ({stats?.coursesPerLanguage?.[index] || 0})
                    </span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 2. GRÁFICA DE PROFESORES POR IDIOMA */}
        <Col lg={4} md={12} className="mb-4">
          <Card className="dashboard-card chart-card h-100">
            <div className="chart-card-header">
              <h6>
                <FaChalkboardTeacher className="me-2" />
                Profesores por Idioma
              </h6>
            </div>
            <Card.Body>
              {createDonutChart(
                stats?.teachersPerLanguage,
                teachersColors,
                "Profesores"
              )}
              <div className="chart-legend">
                {stats?.languages?.map((language, index) => (
                  <div key={index} className="legend-item">
                    <div
                      className="legend-color"
                      style={{
                        backgroundColor:
                          teachersColors[index % teachersColors.length],
                      }}
                    />
                    <span className="legend-text">
                      {language} ({stats?.teachersPerLanguage?.[index] || 0})
                    </span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 3. GRÁFICA DE ESTUDIANTES POR IDIOMA */}
        <Col lg={4} md={12} className="mb-4">
          <Card className="dashboard-card chart-card h-100">
            <div className="chart-card-header">
              <h6>
                <FaGraduationCap className="me-2" />
                Estudiantes por Idioma
              </h6>
            </div>
            <Card.Body>
              {createDonutChart(
                stats?.studentsPerLanguage,
                studentsColors,
                "Estudiantes"
              )}
              <div className="chart-legend">
                {stats?.languages?.map((language, index) => (
                  <div key={index} className="legend-item">
                    <div
                      className="legend-color"
                      style={{
                        backgroundColor:
                          studentsColors[index % studentsColors.length],
                      }}
                    />
                    <span className="legend-text">
                      {language} ({stats?.studentsPerLanguage?.[index] || 0})
                    </span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* GRÁFICAS ALTERNATIVAS CON BARRAS */}
      <Row>
        <Col lg={4} md={12} className="mb-4">
          <Card className="dashboard-card chart-card h-100">
            <div className="chart-card-header">
              <h6>
                <FaChartBar className="me-2" />
                Distribución de Cursos
              </h6>
            </div>
            <Card.Body>
              {createBarChart(stats?.coursesPerLanguage, "#3b82f6", "Cursos")}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={12} className="mb-4">
          <Card className="dashboard-card chart-card h-100">
            <div className="chart-card-header">
              <h6>
                <FaChartBar className="me-2" />
                Distribución de Profesores
              </h6>
            </div>
            <Card.Body>
              {createBarChart(
                stats?.teachersPerLanguage,
                "#10b981",
                "Profesores"
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={12} className="mb-4">
          <Card className="dashboard-card chart-card h-100">
            <div className="chart-card-header">
              <h6>
                <FaChartBar className="me-2" />
                Distribución de Estudiantes
              </h6>
            </div>
            <Card.Body>
              {createBarChart(
                stats?.studentsPerLanguage,
                "#f59e0b",
                "Estudiantes"
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminStats;
