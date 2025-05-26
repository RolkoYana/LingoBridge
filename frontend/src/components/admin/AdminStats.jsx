import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Row, Col, Card, Badge, Spinner, Button } from "react-bootstrap";
import { 
  FaUsers, 
  FaBook, 
  FaCheckCircle, 
  FaChalkboardTeacher,
  FaChartBar,
  FaSyncAlt,
  FaChartLine,
  FaUserGraduate,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaGraduationCap,
  FaLanguage
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { fetchWithAuth } from "../../api/api";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement
);

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWithAuth("/admin/statistics");
      console.log("Datos recibidos:", data);
      setStats(data);
    } catch (err) {
      console.error("Error al cargar estadísticas", err);
      setError(err.message || "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-error">
        <FaChartBar size={48} className="mb-3" />
        <p>Error al cargar estadísticas</p>
        {error && <p className="text-muted small">{error}</p>}
        <Button variant="primary" onClick={loadStats}>
          <FaSyncAlt className="me-2" />
          Reintentar
        </Button>
      </div>
    );
  }

  // Validar que existan los datos necesarios
  const {
    languages = [],
    coursesPerLanguage = [],
    teachersPerLanguage = [],
    studentsPerLanguage = [],
    totalTeachers = 0,
    totalStudents = 0,
    totalCourses = 0,
    completedCourses = 0,
    pendingCourses = 0,
  } = stats;

  // Calcular cursos activos de forma segura
  const activeCoursesCount = Math.max(0, totalCourses - completedCourses - pendingCourses);

  // Configuraciones de gráficos
  const createBarData = (label, data, color) => {
    const validData = Array.isArray(data) ? data.map(value => Math.round(Number(value) || 0)) : [0];
    return {
      labels: Array.isArray(languages) && languages.length > 0 ? languages : ['Sin datos'],
      datasets: [{
        label: label,
        data: validData,
        backgroundColor: color + '80',
        borderColor: color,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }],
    };
  };

  const createDonutData = () => ({
    labels: ['Activos', 'Completados', 'Pendientes'],
    datasets: [{
      data: [activeCoursesCount, completedCourses, pendingCourses],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      borderWidth: 0,
      cutout: '70%',
    }],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'var(--text-color)',
          font: { size: 12, weight: '500' },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: 'var(--text-color)',
          font: { size: 12 }
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          color: 'var(--text-color)',
          font: { size: 12 },
          callback: function(value) {
            if (Number.isInteger(value)) return value;
          }
        },
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            if (total === 0) return `${context.label}: 0%`;
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          }
        }
      }
    },
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h4>Panel de Estadísticas</h4>
          <p>Vista completa del sistema educativo</p>
        </div>
        <Button variant="outline-primary" size="sm" onClick={loadStats} className="refresh-btn">
          <FaSyncAlt />
        </Button>
      </div>

      {/* Tarjetas de Totales Principales */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={4}>
          <Card className="dashboard-card-mini dashboard-card-blue">
            <Card.Body className="p-3">
              <div className="mini-card-content">
                <div className="mini-card-icon dashboard-icon-blue">
                  <FaChalkboardTeacher />
                </div>
                <div className="mini-card-info">
                  <div className="mini-card-value">{totalTeachers}</div>
                  <div className="mini-card-label">Profesores</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={4}>
          <Card className="dashboard-card-mini dashboard-card-success">
            <Card.Body className="p-3">
              <div className="mini-card-content">
                <div className="mini-card-icon dashboard-icon-success">
                  <FaUserGraduate />
                </div>
                <div className="mini-card-info">
                  <div className="mini-card-value">{totalStudents}</div>
                  <div className="mini-card-label">Estudiantes</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={4}>
          <Card className="dashboard-card-mini dashboard-card-warning">
            <Card.Body className="p-3">
              <div className="mini-card-content">
                <div className="mini-card-icon dashboard-icon-warning">
                  <FaBook />
                </div>
                <div className="mini-card-info">
                  <div className="mini-card-value">{Number(totalCourses).toLocaleString()}</div>
                  <div className="mini-card-label">Cursos</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tarjetas de Estado de Cursos */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={4}>
          <Card className="dashboard-card-status status-active">
            <Card.Body className="p-3">
              <div className="status-card-content">
                <div className="status-info">
                  <div className="status-value">{activeCoursesCount}</div>
                  <div className="status-label">Cursos Activos</div>
                  <div className="status-trend">
                    <FaArrowUp className="trend-up" />
                    <span>+8%</span>
                  </div>
                </div>
                <div className="status-icon">
                  <FaGraduationCap />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={4}>
          <Card className="dashboard-card-status status-completed">
            <Card.Body className="p-3">
              <div className="status-card-content">
                <div className="status-info">
                  <div className="status-value">{completedCourses}</div>
                  <div className="status-label">Completados</div>
                  <div className="status-trend">
                    <FaArrowUp className="trend-up" />
                    <span>+24%</span>
                  </div>
                </div>
                <div className="status-icon">
                  <FaCheckCircle />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={4}>
          <Card className="dashboard-card-status status-pending">
            <Card.Body className="p-3">
              <div className="status-card-content">
                <div className="status-info">
                  <div className="status-value">{pendingCourses}</div>
                  <div className="status-label">Pendientes</div>
                  <div className="status-trend">
                    <FaArrowDown className="trend-down" />
                    <span>-5%</span>
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

      {/* Gráficos por Idioma - Sección Principal */}
      <Row className="g-4">
        {/* Distribución General */}
        <Col xs={12} lg={4}>
          <Card className="dashboard-card chart-card">
            <Card.Header className="chart-card-header">
              <h6 className="mb-0 d-flex align-items-center">
                <FaChartLine className="me-2" />
                Distribución de Cursos
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="donut-chart-container">
                <Doughnut data={createDonutData()} options={donutOptions} />
                <div className="donut-center">
                  <div className="donut-percentage">
                    {totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0}%
                  </div>
                  <div className="donut-label">Completado</div>
                </div>
              </div>
              <div className="chart-legend mt-3">
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#3b82f6'}}></span>
                  <span>Activos ({activeCoursesCount})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#10b981'}}></span>
                  <span>Completados ({completedCourses})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#f59e0b'}}></span>
                  <span>Pendientes ({pendingCourses})</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Cursos por Idioma */}
        <Col xs={12} lg={8}>
          <Card className="dashboard-card chart-card">
            <Card.Header className="chart-card-header">
              <h6 className="mb-0 d-flex align-items-center">
                <FaBook className="me-2" />
                Cursos por Idioma
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="bar-chart-container">
                <Bar 
                  data={createBarData("Cursos", coursesPerLanguage, '#3b82f6')} 
                  options={chartOptions} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Profesores por Idioma */}
        <Col xs={12} lg={6}>
          <Card className="dashboard-card chart-card">
            <Card.Header className="chart-card-header">
              <h6 className="mb-0 d-flex align-items-center">
                <FaChalkboardTeacher className="me-2" />
                Profesores por Idioma
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="bar-chart-container">
                <Bar 
                  data={createBarData("Profesores", teachersPerLanguage, '#f59e0b')} 
                  options={chartOptions} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Estudiantes por Idioma */}
        <Col xs={12} lg={6}>
          <Card className="dashboard-card chart-card">
            <Card.Header className="chart-card-header">
              <h6 className="mb-0 d-flex align-items-center">
                <FaUserGraduate className="me-2" />
                Estudiantes por Idioma
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="bar-chart-container">
                <Bar 
                  data={createBarData("Estudiantes", studentsPerLanguage, '#10b981')} 
                  options={chartOptions} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminStats;