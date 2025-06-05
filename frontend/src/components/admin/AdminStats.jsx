import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
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
} from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";
import "./AdminStats.css";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth("/admin/stats");
      setStats(data);
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      setError("Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
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
        <FaChartLine size={48} />
        <p>{error}</p>
        <Button variant="outline-primary" onClick={fetchStats}>
          <FaSync className="me-2" />
          Reintentar
        </Button>
      </div>
    );
  }

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
          <FaRefresh className={loading ? "fa-spin" : ""} />
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
                  <h3 className="mini-card-value">{stats?.totalUsers || 0}</h3>
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
                    {stats?.totalEnrollments || 0}
                  </h3>
                  <p className="mini-card-label">Total Inscripciones</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} md={6} sm={6} xs={12} className="mb-3">
          <Card className="dashboard-card-mini dashboard-card-blue h-100">
            <Card.Body className="p-3">
              <div className="mini-card-content">
                <div className="mini-card-icon dashboard-icon-blue">
                  <FaChartLine />
                </div>
                <div className="mini-card-info">
                  <h3 className="mini-card-value">
                    {stats?.completionRate || 0}%
                  </h3>
                  <p className="mini-card-label">Tasa Completación</p>
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
                  <h4 className="status-value">{stats?.activeCourses || 0}</h4>
                  <p className="status-label">Cursos Activos</p>
                  <div className="status-trend">
                    <FaArrowUp className="trend-up" />
                    +12% este mes
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
                    +8% este mes
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
                    <FaArrowDown className="trend-down" />
                    -5% este mes
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

      {/* Gráficos */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="dashboard-card chart-card h-100">
            <div className="chart-card-header">
              <h6>
                <FaChartLine className="me-2" />
                Distribución de Cursos
              </h6>
            </div>
            <Card.Body>
              <div className="donut-chart-container">
                {/* Aquí iría el gráfico de donut */}
                <div className="donut-center">
                  <div className="donut-percentage">75%</div>
                  <div className="donut-label">Completados</div>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: "#10b981" }}
                  ></div>
                  Completados ({stats?.completedCourses || 0})
                </div>
                <div className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: "#3b82f6" }}
                  ></div>
                  Activos ({stats?.activeCourses || 0})
                </div>
                <div className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: "#f59e0b" }}
                  ></div>
                  Pendientes ({stats?.pendingCourses || 0})
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="dashboard-card chart-card h-100">
            <div className="chart-card-header">
              <h6>
                <FaUsers className="me-2" />
                Crecimiento de Usuarios
              </h6>
            </div>
            <Card.Body>
              <div className="bar-chart-container">
                {/* Aquí iría el gráfico de barras */}
                <div className="d-flex align-items-center justify-content-center h-100">
                  <p className="text-muted">
                    Gráfico de barras - Últimos 6 meses
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminStats;
