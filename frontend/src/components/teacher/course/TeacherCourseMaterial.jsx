import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { fetchWithAuth } from "../../../api/api";
import "./TeacherCourseMaterial.css";

const TeacherCourseMaterial = ({ courseId, refresh, onRefreshHandled }) => {
  const [material, setMaterial] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await fetchWithAuth(
          `/teacher/course/${courseId}/material`
        );
        setMaterial(data); 
      } catch (error) {
        console.error("Error al cargar los materiales:", error);
      } finally {
        if (onRefreshHandled) onRefreshHandled(); 
      }
    };

    fetchMaterials();
  }, [courseId, refresh]);

  const getEmbedUrl = (url) => {
    const videoIdMatch = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return null;
  };

  const handleDownload = (filename) => {
    const downloadUrl = `/teacher/course/${courseId}/material/download/${filename}`;

    fetchWithAuth(downloadUrl, {}, true) // expectBlob = true
      .then((blob) => {
        // verificar si el archivo recibido es un PDF
        if (
          blob.type !== "application/pdf" &&
          blob.type !== "application/octet-stream"
        ) {
          console.error(
            "No se recibió un archivo PDF válido. Tipo recibido:",
            blob.type
          );
          return;
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error al descargar el archivo:", error);
      });
  };

  const getFilenameFromPath = (path) => {
    return path.split("/").pop();
  };

  return (
    <Card className="teacher-course-material">
      <Card.Header>
        <h2>Material del Curso</h2>
      </Card.Header>
      <Card.Body>
        {material.length === 0 ? (
          <p>No hay materiales disponibles.</p>
        ) : (
          <ListGroup variant="flush">
            {material.map((material) => (
              <ListGroup.Item key={material.id} className="material-item">
                <h5>{material.title}</h5>
                {material.youtubeLink ? (
                  <div className="video-container">
                    <iframe
                      width="100%"
                      height="315"
                      src={getEmbedUrl(material.youtubeLink)}
                      title={material.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  material.filename && ( 
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDownload(material.filename)}
                    >
                      Descargar archivo
                    </button>
                  )
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default TeacherCourseMaterial;