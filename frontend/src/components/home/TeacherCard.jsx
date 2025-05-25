import React from "react";
import { FaGraduationCap, FaLanguage } from "react-icons/fa";

const TeacherCard = ({ name, teaches, speaks, image }) => {
  return (
    <div
      className="card text-center p-3 shadow-sm h-100 d-flex flex-column justify-content-between border-0" // Añadir h-100 y border-0
      style={{ minWidth: "260px" }} // Mantener minWidth para asegurar que no se achique demasiado
    >
      <img
        src={image}
        alt={`Foto de ${name}`}
        className="rounded-circle mx-auto mb-3 border border-3 border-primary" // Borde con color primario
        width="130"
        height="130"
        style={{ objectFit: "cover" }}
      />
      <h6 className="fw-bold mb-2">{name}</h6> {/* Nombre en negrita */}
      <p className="mb-1 text-muted"> {/* Texto más suave */}
        <FaGraduationCap className="me-2 text-info" /> {/* Color diferente para el icono */}
        <strong>Enseña:</strong> {teaches}
      </p>
      <p className="mb-0 text-muted"> {/* Texto más suave */}
        <FaLanguage className="me-2 text-warning" /> {/* Color diferente para el icono */}
        <strong>Habla:</strong> {speaks}
      </p>
    </div>
  );
};

export default TeacherCard;