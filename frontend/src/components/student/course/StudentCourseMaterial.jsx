import React, { useEffect, useState } from "react";
import { Spinner, Alert, Card, Badge } from "react-bootstrap";
import { FaFilePdf, FaYoutube, FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import { fetchWithAuth } from "../../../api/api";
import "./StudentCourseMaterial.css";

const StudentCourseMaterial = ({ courseId }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!courseId) {
          setError("No se ha proporcionado un curso válido.");
          return;
        }

        const data = await fetchWithAuth(`/student/course/${courseId}/material`);

        if (Array.isArray(data)) {
          setMaterials(data);
        } else {
          setMaterials([]);
        }
      } catch (error) {
        setError("Error al cargar los materiales: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadMaterials();
    }
  }, [courseId]);

  const pdfMaterials = materials.filter((m) => m.filename);
  const youtubeMaterials = materials.filter((m) => m.youtubeLink);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const handlePdfDownload = async (courseId, filename) => {
    try {
      const blob = await fetchWithAuth(
        `/student/course/${courseId}/material/download/${filename}`,
        { method: "GET" },
        true
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("No se pudo descargar el archivo");
    }
  };

  const handleYouTubeClick = (material) => {
    window.open(material.youtubeLink, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="materials-loading">
        <Spinner animation="border" variant="primary" />
        <p>Cargando materiales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="materials-container">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="materials-container">
        <div className="materials-empty">
          <h5>📚 No hay materiales disponibles</h5>
          <p>El profesor aún no ha subido materiales para este curso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="materials-container">
      {/* Documentos PDF */}
      {pdfMaterials.length > 0 && (
        <div className="materials-section">
          <h5 className="section-title">
            <FaFilePdf className="section-icon" />
            Documentos PDF
            <Badge bg="primary">{pdfMaterials.length}</Badge>
          </h5>
          
          <div className="materials-grid">
            {pdfMaterials.map((material) => (
              <Card 
                key={material.id} 
                className="material-card pdf-card"
                onClick={() => handlePdfDownload(courseId, material.filename)}
              >
                <Card.Body>
                  <div className="material-header">
                    <div className="material-icon pdf-icon">
                      <FaFilePdf />
                    </div>
                    <div className="material-info">
                      <h6 className="material-title">{material.title}</h6>
                      <p className="material-filename">{material.filename}</p>
                      <small className="material-date">{formatDate(material.uploadedAt)}</small>
                    </div>
                  </div>
                  <div className="material-action">
                    <FaDownload /> Descargar
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Videos de YouTube */}
      {youtubeMaterials.length > 0 && (
        <div className="materials-section">
          <h5 className="section-title">
            <FaYoutube className="section-icon" />
            Videos de YouTube
            <Badge bg="danger">{youtubeMaterials.length}</Badge>
          </h5>
          
          <div className="materials-grid">
            {youtubeMaterials.map((material) => {
              const videoId = getYouTubeVideoId(material.youtubeLink);

              return (
                <Card key={material.id} className="material-card youtube-card">
                  <Card.Body>
                    <div className="material-header">
                      <div className="material-icon youtube-icon">
                        <FaYoutube />
                      </div>
                      <div className="material-info">
                        <h6 className="material-title">{material.title}</h6>
                        <p className="material-filename">Video de YouTube</p>
                        <small className="material-date">{formatDate(material.uploadedAt)}</small>
                      </div>
                    </div>

                    {videoId && (
                      <div className="youtube-embed">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={material.title}
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                    )}

                    <div 
                      className="material-action youtube-action"
                      onClick={() => handleYouTubeClick(material)}
                    >
                      <FaExternalLinkAlt /> Ver en YouTube
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourseMaterial;