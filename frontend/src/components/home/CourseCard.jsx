import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import "./CourseCard.css";

const CourseCard = ({ name, image, features, buttonText, courseType }) => {
  const navigate = useNavigate();

  const handleNavigateToCourse = () => {
    // Mapear el tipo de curso a la ruta correspondiente
    const routeMap = {
      'Intensivo': '/course/intensive',
      'Flexible': '/course/flexible',
      'Grupal': '/course/group'
    };
    
    const route = routeMap[courseType] || routeMap[name];
    if (route) {
      navigate(route);
    }
  };

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
            <button 
              className="btn btn-outline-primary"
              onClick={handleNavigateToCourse}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;