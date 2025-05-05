import React from "react";

const CourseCard = ({ name, image, features }) => {
  return (
    <div className="card h-100 shadow-sm">
      <img src={image} className="card-img-top" alt={name} />
      <div className="card-body text-center">
        <h5 className="card-title fw-bold">{name}</h5>
        <ul className="text-start">
          {features.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <button className="btn btn-primary mt-3">
          Más información sobre {name}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
