import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
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
        setMaterial(data);
      } catch (err) {
        setError("Error al cargar los materiales.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [courseId]);

  if (loading) {
    return <div>Cargando materiales...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Card className="p-3 mb-3">
      <h2>Material del Curso</h2>
      {material.length === 0 ? (
        <p>No hay materiales disponibles.</p>
      ) : (
        <ListGroup variant="flush">
          {material.map((mat) => (
            <ListGroup.Item key={mat.id}>
              <h5>{mat.title.replace(/"/g, "")}</h5>{" "}
              {/* Limpiar las comillas del título */}
              {mat.youtubeLink ? (
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${mat.youtubeLink}`}
                  title={mat.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                mat.filename && (
                  <div>
                    <a
                      href={`/api/student/course/${courseId}/material/download/${mat.filename}`}
                      className="btn btn-link p-0"
                      download
                    >
                      Descargar archivo: {mat.filename}
                    </a>
                  </div>
                )
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card>
  );
};

export default StudentCourseMaterial;
