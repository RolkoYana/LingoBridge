import React from "react";
import CourseCard from "../CourseCard";
import Course from "./Course";

const StudentCourses = () => {
  const myCourses = [
    { title: "Inglés A1", teacher: "Alex", progress: 50 },
    { title: "Francés B1", teacher: "Sophie", progress: 80 },
  ];

  return (
    <div className="mt-3">
      <h5>Mis cursos</h5>
      {myCourses.map((c, i) => (
        <Course key={i} {...c} />
      ))}
    </div>
  );
};

export default StudentCourses;
