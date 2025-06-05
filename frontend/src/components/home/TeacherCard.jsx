import React from "react";
import { FaGraduationCap, FaLanguage } from "react-icons/fa";
import "./TeacherCard.css";

const TeacherCard = ({ name, teaches, speaks, image }) => {
  return (
    <div className="card h-100 shadow-sm border-0">
      {/* Imagen como header de la card */}
      <div className="teacher-image-container">
        <img
          src={image}
          alt={name}
          className="teacher-image"
        />
      </div>
      
      {/* Contenido de la card */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-center mb-3">{name}</h5>
        
        <div className="teacher-info flex-grow-1 text-center">
          <p className="mb-2 d-flex align-items-center justify-content-center">
            <FaGraduationCap className="me-2 text-success" />
            <strong>Enseña:</strong> {teaches}
          </p>
          <p className="mb-0 d-flex align-items-center justify-content-center">
            <FaLanguage className="me-2 text-info" />
            <strong>Habla:</strong> {speaks}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;