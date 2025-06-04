import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import { fetchWithAuth } from "../../api/api";
import "./AddMaterialForm.css";

const AddMaterialForm = ({ courseId, onMaterialUploaded }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setMessage("Debes ingresar un título.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("youtubeLink", youtubeLink);

    // Solo añadir el archivo si existe
    if (file) {
      formData.append("file", file);
    }

    try {
      setUploading(true);
      await fetchWithAuth(`/teacher/course/${courseId}/add-material`, {
        method: "POST",
        body: formData,
      });

      setMessage("Material subido correctamente.");
      setTitle("");
      setFile(null);
      setYoutubeLink("");
      if (onMaterialUploaded) onMaterialUploaded();
    } catch (error) {
      console.error(error);
      setMessage("Error al subir el material.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-material-form">
      <div className="material-form-header">
        <div className="material-form-icon">
          <FaUpload />
        </div>
        <div>
          <h5 className="material-form-title">Subir Material</h5>
          <p className="material-form-subtitle">
            Añade archivos o enlaces de YouTube al curso
          </p>
        </div>
      </div>

      {message && (
        <Alert 
          variant={message.includes("Error") ? "danger" : "success"}
          dismissible
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className={uploading ? "uploading-overlay" : ""}>
        <Form.Group className="mb-3">
          <Form.Label className="required-field">Título</Form.Label>
          <Form.Control
            type="text"
            placeholder="Título del material"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subir archivo</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={uploading}
          />
          <div className="form-hint">
            Formatos soportados: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Enlace de YouTube (opcional)</Form.Label>
          <Form.Control
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            disabled={uploading}
          />
          <div className="form-hint">
            Pega aquí el enlace completo del vídeo de YouTube
          </div>
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button type="submit" disabled={uploading}>
            {uploading ? "Subiendo..." : "Subir Material"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddMaterialForm;