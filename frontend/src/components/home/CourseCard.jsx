// src/components/CourseCard.jsx
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa'; // Icono para las características

const CourseCard = ({ name, image, features, buttonText }) => {
  return (
    <div className="card h-100 shadow-sm border-0 d-flex flex-column"> {/* h-100 para misma altura, border-0 */}
      <img
        src={image}
        className="card-img-top"
        alt={`Imagen de curso ${name}`}
        style={{ height: "200px", objectFit: "cover" }} // Altura fija para las imágenes de la tarjeta
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-center mb-3">{name}</h5>
        <ul className="list-unstyled flex-grow-1"> {/* flex-grow-1 para empujar el botón abajo */}
          {features.map((feature, index) => (
            <li key={index} className="mb-2">
              <span className="me-2 text-success">{feature.icon || <FaCheckCircle />}</span> {/* Ícono por defecto o el pasado */}
              {feature.text}
            </li>
          ))}
        </ul>
        <div className="text-center mt-3">
          <button className="btn btn-outline-primary">{buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;