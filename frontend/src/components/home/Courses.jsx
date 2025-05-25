import React from "react";
import CourseCard from "./CourseCard";
import intensive from "../../assets/courses/intensivo.jpg"
import flexible from "../../assets/courses/flexible.jpg";
import group from "../../assets/courses/grupal.jpg";
import { FaBookOpen, FaCalendarAlt, FaUsers } from "react-icons/fa"; // Nuevos iconos para características

const Courses = () => {
  const courses = [
    {
      name: "Intensivo",
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
    <section className="py-5">
      {" "}
      {/* Eliminado bg-light */}
      <div className="container">
        <h2 className="text-center mb-5 display-5 fw-bold">Nuestros cursos</h2>{" "}
        {/* Título más grande */}
        <div className="row justify-content-center">
          {courses.map((course, index) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
              {" "}
              {/* Mejorar responsividad */}
              <CourseCard
                name={course.name}
                image={course.image}
                features={course.features}
                buttonText={course.buttonText} // Pasar el texto del botón
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
