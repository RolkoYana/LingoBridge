import React, { useEffect, useState } from "react";
import { Spinner, Alert, Badge } from "react-bootstrap";
import { 
  FaDownload, 
  FaYoutube, 
  FaFile, 
  FaFilePdf, 
  FaFileWord, 
  FaFileImage,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaPlay,
  FaFileArchive
} from "react-icons/fa";
import { fetchWithAuth } from "../../../api/api";

const StudentCourseMaterial = ({ courseId }) => {
  const [material, setMaterial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWithAuth(
          `/student/course/${courseId}/material`
        );
        setMaterial(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Error al cargar los materiales del curso.");
        console.error("Error loading materials:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchMaterials();
    }
  }, [courseId]);

  // Función para obtener el icono según el tipo de archivo
  const getFileIcon = (filename) => {
    if (!filename) return FaFile;
    
    const extension = filename.toLowerCase().split('.').pop();
    switch (extension) {
      case 'pdf':
        return FaFilePdf;
      case 'doc':
      case 'docx':
        return FaFileWord;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return FaFileImage;
      case 'zip':
      case 'rar':
      case '7z':
        return FaFileArchive;
      default:
        return FaFile;
    }
  };

  // Función para obtener el color del badge según el tipo
  const getFileTypeColor = (filename) => {
    if (!filename) return 'secondary';
    
    const extension = filename.toLowerCase().split('.').pop();
    switch (extension) {
      case 'pdf':
        return 'danger';
      case 'doc':
      case 'docx':
        return 'primary';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return 'success';
      case 'zip':
      case 'rar':
      case '7z':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (filename) => {
    const downloadUrl = `/api/student/course/${courseId}/material/download/${filename}`;
    window.open(downloadUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="material-loading">
        <Spinner animation="border" variant="primary" size="sm" />
        <span>Cargando materiales...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="material-error">
        <FaInfoCircle />
        <span>{error}</span>
      </div>
    );
  }

  if (material.length === 0) {
    return (
      <div className="material-empty">
        <div className="empty-icon">
          <FaFile size={48} />
        </div>
        <h6 className="empty-title">No hay materiales disponibles</h6>
        <p className="empty-text">
          El profesor aún no ha subido materiales para este curso.
          Te notificaremos cuando haya nuevo contenido disponible.
        </p>
      </div>
    );
  }

  // Separar materiales por tipo
  const videoMaterials = material.filter(m => m.youtubeLink);
  const fileMaterials = material.filter(m => m.filename && !m.youtubeLink);

  return (
    <div className="materials-container">
      {/* Estadísticas de materiales */}
      <div className="materials-stats">
        <div className="stat-item">
          <span className="stat-number">{material.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{videoMaterials.length}</span>
          <span className="stat-label">Videos</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{fileMaterials.length}</span>
          <span className="stat-label">Archivos</span>
        </div>
      </div>

      {/* Lista de materiales */}
      <div className="materials-list">
        {material.map((mat, index) => {
          const FileIcon = getFileIcon(mat.filename);
          const cleanTitle = mat.title ? mat.title.replace(/"/g, "") : `Material ${index + 1}`;
          
          return (
            <div key={mat.id || index} className="material-item">
              <div className="material-header">
                <div className="material-info">
                  <div className="material-icon">
                    {mat.youtubeLink ? (
                      <FaYoutube className="youtube-icon" />
                    ) : (
                      <FileIcon className="file-icon" />
                    )}
                  </div>
                  <div className="material-details">
                    <h6 className="material-title">{cleanTitle}</h6>
                    <div className="material-meta">
                      {mat.youtubeLink ? (
                        <Badge bg="danger" className="material-badge">
                          <FaYoutube className="me-1" />
                          Video YouTube
                        </Badge>
                      ) : mat.filename ? (
                        <Badge 
                          bg={getFileTypeColor(mat.filename)} 
                          className="material-badge"
                        >
                          <FileIcon className="me-1" />
                          {mat.filename.split('.').pop().toUpperCase()}
                        </Badge>
                      ) : null}
                      
                      {mat.fileSize && (
                        <span className="file-size">
                          {formatFileSize(mat.fileSize)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Acciones */}
                <div className="material-actions">
                  {mat.filename && (
                    <button
                      className="btn-download"
                      onClick={() => handleDownload(mat.filename)}
                      title={`Descargar ${mat.filename}`}
                    >
                      <FaDownload />
                    </button>
                  )}
                  {mat.youtubeLink && (
                    <a
                      href={`https://www.youtube.com/watch?v=${mat.youtubeLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-external"
                      title="Ver en YouTube"
                    >
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>

              {/* Contenido del material */}
              <div className="material-content">
                {mat.youtubeLink ? (
                  <div className="youtube-container">
                    <iframe
                      src={`https://www.youtube.com/embed/${mat.youtubeLink}`}
                      title={cleanTitle}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="youtube-iframe"
                    />
                    <div className="video-overlay">
                      <FaPlay className="play-icon" />
                    </div>
                  </div>
                ) : mat.filename ? (
                  <div className="file-preview">
                    <div className="file-info">
                      <div className="file-icon-large">
                        <FileIcon />
                      </div>
                      <div className="file-details">
                        <span className="filename">{mat.filename}</span>
                        <span className="file-type">
                          Archivo {mat.filename.split('.').pop().toUpperCase()}
                        </span>
                        {mat.fileSize && (
                          <span className="file-size-large">
                            {formatFileSize(mat.fileSize)}
                          </span>
                        )}
                      </div>
                      <button
                        className="btn-download-primary"
                        onClick={() => handleDownload(mat.filename)}
                      >
                        <FaDownload className="me-2" />
                        Descargar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="material-placeholder">
                    <FaInfoCircle className="placeholder-icon" />
                    <p>Material sin contenido disponible</p>
                  </div>
                )}
              </div>
              
              {/* Descripción del material si existe */}
              {mat.description && (
                <div className="material-description">
                  <p>{mat.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      {material.length > 0 && (
        <div className="materials-footer">
          <div className="footer-info">
            <FaInfoCircle className="info-icon" />
            <span>
              Todos los materiales están disponibles para descarga. 
              Los videos de YouTube requieren conexión a internet.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourseMaterial;