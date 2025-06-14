import React from "react";
import CourseCard from "./CourseCard";
import intensive from "../../assets/courses/intensivo.jpg"
import flexible from "../../assets/courses/flexible.jpg";
import group from "../../assets/courses/grupal.jpg";
import { FaBookOpen, FaCalendarAlt, FaUsers } from "react-icons/fa"; 
import "./Courses.css";

const Courses = () => {
  const courses = [
    {
      name: "Intensivo",
      courseType: "Intensivo", // Agregar identificador del tipo de curso
      image: intensive,
      features: [
        { text: "Aprende un idioma en 2 meses", icon: <FaBookOpen /> },
        { text: "Clases diarias", icon: <FaCalendarAlt /> },
        { text: "Material personalizado", icon: <FaBookOpen /> },
      ],
      buttonText: "Más información sobre Intensivo",
    },
    {
      name: "Flexible",
      courseType: "Flexible", // Agregar identificador del tipo de curso
      image: flexible,
      features: [
        { text: "Asiste a las clases cuando quieras", icon: <FaCalendarAlt /> },
        { text: "Acceso a grabaciones", icon: <FaBookOpen /> },
        { text: "Máxima flexibilidad", icon: <FaCalendarAlt /> },
      ],
      buttonText: "Más información sobre Flexible",
    },
    {
      name: "Grupal",
      courseType: "Grupal", // Agregar identificador del tipo de curso
      image: group,
      features: [
        { text: "Haz un curso en un grupo", icon: <FaUsers /> },
        { text: "Proyectos colaborativos", icon: <FaUsers /> },
        { text: "Trabajo en equipo", icon: <FaUsers /> },
      ],
      buttonText: "Más información sobre Grupal",
    },
  ];

  return (
    <div className="courses">
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 display-5 fw-bold">Nuestros cursos</h2>
          <div className="row justify-content-center">
            {courses.map((course, index) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                <CourseCard
                  name={course.name}
                  courseType={course.courseType}
                  image={course.image}
                  features={course.features}
                  buttonText={course.buttonText}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;