import React, { useEffect, useState } from "react";
import { Card, ListGroup, Modal, Button, Alert } from "react-bootstrap";
import { FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { fetchWithAuth } from "../../../api/api";
import EditMaterialForm from "../../forms/EditMaterialForm.jsx";
import "./TeacherCourseMaterial.css";

const TeacherCourseMaterial = ({ courseId, refresh, onRefreshHandled }) => {
  const [material, setMaterial] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

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

    fetchWithAuth(downloadUrl, {}, true)
      .then((blob) => {
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

  const handleDeleteClick = (materialItem) => {
    setSelectedMaterial(materialItem);
    setShowDeleteModal(true);
    setDeleteMessage("");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMaterial) return;

    // Obtener el usuario autenticado
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
      setDeleteMessage("No se encontró el usuario autenticado.");
      return;
    }

    setDeleting(true);
    setDeleteMessage("");

    try {
      await fetchWithAuth(`/teacher/material/${selectedMaterial.id}`, {
        method: "DELETE"
      });
      
      setMaterial(material.filter(m => m.id !== selectedMaterial.id));
      setDeleteMessage("Material eliminado correctamente.");
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setSelectedMaterial(null);
        setDeleteMessage("");
      }, 1500);
      
    } catch (error) {
      console.error("Error al eliminar material:", error);
      setDeleteMessage("Error al eliminar el material. Inténtalo de nuevo.");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (materialItem) => {
    setSelectedMaterial(materialItem);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedMaterial(null);
    // Recargar los materiales
    const fetchMaterials = async () => {
      try {
        const data = await fetchWithAuth(
          `/teacher/course/${courseId}/material`
        );
        setMaterial(data);
      } catch (error) {
        console.error("Error al recargar los materiales:", error);
      }
    };
    fetchMaterials();
  };

  const getFilenameFromPath = (path) => {
    return path.split("/").pop();
  };

  return (
    <>
      <Card className="teacher-course-material">
        <Card.Header>
          <h2>Material del Curso</h2>
        </Card.Header>
        <Card.Body>
          {material.length === 0 ? (
            <p>No hay materiales disponibles.</p>
          ) : (
            <ListGroup variant="flush">
              {material.map((materialItem) => (
                <ListGroup.Item key={materialItem.id} className="material-item">
                  <div className="material-content">
                    <h5>{materialItem.title}</h5>
                    
                    {materialItem.youtubeLink ? (
                      <div className="video-container">
                        <iframe
                          width="100%"
                          height="315"
                          src={getEmbedUrl(materialItem.youtubeLink)}
                          title={materialItem.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      materialItem.filename && ( 
                        <button
                          className="btn btn-primary download-btn"
                          onClick={() => handleDownload(materialItem.filename)}
                        >
                          Descargar archivo
                        </button>
                      )
                    )}
                  </div>
                  
                  <div className="material-actions">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditClick(materialItem)}
                      className="action-btn edit-btn"
                    >
                      <FaEdit className="me-1" />
                      Modificar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(materialItem)}
                      className="action-btn delete-btn"
                    >
                      <FaTrash className="me-1" />
                      Eliminar
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Modal de confirmación para eliminar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <FaExclamationTriangle className="text-warning me-2" />
            Confirmar eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteMessage && (
            <Alert 
              variant={deleteMessage.includes("Error") ? "danger" : "success"}
              className="mb-3"
            >
              {deleteMessage}
            </Alert>
          )}
          
          {!deleteMessage && (
            <div>
              <p className="mb-3">
                ¿Estás seguro de que quieres eliminar el material <strong>"{selectedMaterial?.title}"</strong>?
              </p>
              <div className="alert alert-warning">
                <small>
                  <strong>Atención:</strong> Esta acción no se puede deshacer.
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!deleteMessage && (
            <>
              <Button 
                variant="secondary" 
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <FaTrash className="me-1" />
                    Eliminar
                  </>
                )}
              </Button>
            </>
          )}
          
          {deleteMessage && !deleteMessage.includes("Error") && (
            <Button 
              variant="primary" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cerrar
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal para editar material */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" />
            Modificar Material
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMaterial && (
            <EditMaterialForm
              materialId={selectedMaterial.id}
              initialData={{
                title: selectedMaterial.title,
                youtubeLink: selectedMaterial.youtubeLink || "",
                hasFile: !!selectedMaterial.filename
              }}
              onSuccess={handleEditSuccess}
              onCancel={() => setShowEditModal(false)}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TeacherCourseMaterial;