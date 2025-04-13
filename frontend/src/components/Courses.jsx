import React from "react";
import CourseCard from "./CourseCard";
import intensive from "../assets/courses/intensivo.jpg";
import flexible from "../assets/courses/flexible.jpg";
import group from "../assets/courses/grupal.jpg";

const Courses = () => {
  const courses = [
    {
      name: "Intensivo",
      image: intensive,
      features:[
        "Aprende un idioma en 2 meses",
        "Clases diarias",
        "Material personalizado"
      ],
    },
    {
      name: "Flexible",
      image: flexible,
      features:[
        "Asiste a las clases cuando quieras",
        "Acceso a grabaciones",
        "Máxima flexibilidad"
      ],
    },
    {
      name: "Grupal",
      image: group,
      features:[
        "Haz un curso en un grupo",
        "Proyectos colaborativos",
        "Trabajo en equipo"
      ],
    },
  ];

  return (
    <section className="container bg-light">
      <h2 className="text-center mb-4">Nuestros cursos</h2>
      <div className="row justify-content-center">
        {courses.map((course, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <CourseCard 
              name={course.name}
              image={course.image}
              features={course.features}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Courses;
