import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";

const EditMaterialForm = ({ materialId, initialData, onSuccess, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [file, setFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState(initialData.youtubeLink || "");
  const [message, setMessage] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("El título es obligatorio.");
      return;
    }

    // Obtener el usuario autenticado
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
      setMessage("No se encontró el usuario autenticado.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("youtubeLink", youtubeLink);

    // Solo añadir el archivo si se seleccionó uno nuevo
    if (file) {
      formData.append("file", file);
    }

    try {
      setUpdating(true);
      setMessage("");
      
      // Agregar el teacherUsername como query parameter
      await fetchWithAuth(`/teacher/material/${materialId}?teacherUsername=${user.username}`, {
        method: "PUT",
        body: formData,
      });

      setMessage("Material actualizado correctamente.");
      
      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        onSuccess();
      }, 1500);
      
    } catch (error) {
      console.error("Error al actualizar material:", error);
      setMessage("Error al actualizar el material. Inténtalo de nuevo.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="edit-material-form">
      <div className="material-form-header">
        <div className="material-form-icon edit-icon">
          <FaEdit />
        </div>
        <div>
          <h5 className="material-form-title">Modificar Material</h5>
          <p className="material-form-subtitle">
            Actualiza la información del material
          </p>
        </div>
      </div>

      {message && (
        <Alert 
          variant={message.includes("Error") ? "danger" : "success"}
          className="mb-3"
        >
          {message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className={updating ? "uploading-overlay" : ""}>
        <Form.Group className="mb-3">
          <Form.Label className="required-field">Título</Form.Label>
          <Form.Control
            type="text"
            placeholder="Título del material"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={updating}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cambiar archivo</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={updating}
          />
          <div className="form-hint">
            {initialData.hasFile 
              ? "Deja vacío si no quieres cambiar el archivo actual" 
              : "Selecciona un archivo si quieres añadir uno"
            }
          </div>
          <div className="form-hint">
            Formatos soportados: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Enlace de YouTube (opcional)</Form.Label>
          <Form.Control
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            disabled={updating}
          />
          <div className="form-hint">
            Pega aquí el enlace completo del vídeo de YouTube
          </div>
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button 
            variant="outline-secondary" 
            onClick={onCancel}
            disabled={updating}
          >
            <FaTimes className="me-1" />
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={updating}
          >
            {updating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Actualizando...
              </>
            ) : (
              <>
                <FaSave className="me-1" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditMaterialForm;