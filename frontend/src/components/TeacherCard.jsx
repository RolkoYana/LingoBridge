import React from "react";
import { FaGraduationCap, FaLanguage } from "react-icons/fa";

const TeacherCard = ({ name, teaches, speaks, image }) => {
  return (
    <div
      className="card text-center p-3 shadow-sm"
      style={{ width: "260px", minWidth: "260px" }}
    >
      <img
        src={image}
        alt={name}
        className="rounded-circle mx-auto mb-3"
        width="130"
        height="130"
        style={{ objectFit: "cover" }}
      />
      <h6>{name}</h6>
      <p className="mb-1">
        <FaGraduationCap className="me-1 text-primary" />{" "}
        <strong>Enseña:</strong> {teaches}
      </p>
      <p className="mb-0">
        <FaLanguage className="me-1 text-success" /> <strong>Habla:</strong>{" "}
        {speaks}
      </p>
    </div>
  );
};

export default TeacherCard;
