import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { fetchWithAuth } from "../../api/api";

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
      if (onMaterialUploaded) onMaterialUploaded();
    } catch (error) {
      console.error(error);
      setMessage("Error al subir el material.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-4 text-start">
      {message && <Alert variant="info">{message}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Título</Form.Label>
        <Form.Control
          type="text"
          placeholder="Título del material"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Subir archivo</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Enlace de YouTube (opcional)</Form.Label>
        <Form.Control
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
        />
      </Form.Group>

      <Button type="submit" disabled={uploading}>
        {uploading ? "Subiendo..." : "Subir Material"}
      </Button>
    </Form>
  );
};

export default AddMaterialForm;
