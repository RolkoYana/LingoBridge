import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import "./CourseCard.css";

const CourseCard = ({ name, image, features, buttonText }) => {
  return (
    <div className="course-card">
      <div className="card h-100 shadow-sm border-0 d-flex flex-column"> 
        <img
          src={image}
          className="card-img-top"
          alt={`Imagen de curso ${name}`}
          style={{ height: "200px", objectFit: "cover" }} 
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-center mb-3">{name}</h5>
          <ul className="list-unstyled flex-grow-1"> 
            {features.map((feature, index) => (
              <li key={index} className="mb-2">
                <span className="me-2 text-success">{feature.icon || <FaCheckCircle />}</span> 
                {feature.text}
              </li>
            ))}
          </ul>
          <div className="text-center mt-3">
            <button className="btn btn-outline-primary">{buttonText}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;