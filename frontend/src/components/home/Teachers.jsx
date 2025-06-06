import React, { useState } from "react";
import TeacherCard from "../home/TeacherCard";
import imgPilar from "../../assets/teachers/Pilar_espaniol.jpg";
import imgDaniel from "../../assets/teachers/Daniel_aleman.jpg";
import imgSophie from "../../assets/teachers/Sophie_frances.jpg";
import imgAlex from "../../assets/teachers/Alex_ingles.jpg";
import imgGabriel from "../../assets/teachers/Gabriel_frances.jpg";
import imgAna from "../../assets/teachers/Anna_ingles.jpg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Teachers.css";

const teachers = [
  { name: "Pilar", teaches: "Español", speaks: "Español, Inglés", image: imgPilar },
  { name: "Daniel", teaches: "Alemán", speaks: "Alemán, Inglés", image: imgDaniel },
  { name: "Alex", teaches: "Inglés", speaks: "Inglés, Español", image: imgAlex },
  { name: "Sophie", teaches: "Francés", speaks: "Francés, Inglés", image: imgSophie },
  { name: "Anna", teaches: "Inglés", speaks: "Inglés, Español", image: imgAna },
  { name: "Gabriel", teaches: "Francés", speaks: "Francés, Inglés", image: imgGabriel },
];

const Teachers = () => {
  const [startIndex, setStartIndex] = useState(0);

  const getVisibleCount = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    return 3;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  React.useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getVisibleTeachers = () => {
    const visible = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (startIndex + i) % teachers.length;
      visible.push(teachers[index]);
    }
    return visible;
  };

  const scroll = (dir) => {
    if (dir === "left") {
      setStartIndex((prev) => (prev - 1 + teachers.length) % teachers.length);
    } else {
      setStartIndex((prev) => (prev + 1) % teachers.length);
    }
  };

  return (
    <div className="teachers">
      <section className="py-5"> 
        <div className="container">
          <h2 className="text-center mb-5 display-5 fw-bold">Conoce a nuestros profesores</h2>

          <div className="position-relative d-flex align-items-center justify-content-center">
            {/* Flecha izquierda */}
            <button 
              onClick={() => scroll("left")} 
              className="btn btn-outline-secondary rounded-circle me-3 d-none d-md-flex align-items-center justify-content-center"
              style={{ width: "50px", height: "50px", flexShrink: 0 }}
            >
              <FaChevronLeft />
            </button>

            {/* Grid de profesores */}
            <div className="row justify-content-center flex-grow-1">
              {getVisibleTeachers().map((teacher, i) => (
                <div className="col-12 col-md-6 col-lg-4 mb-4" key={i}>
                  <TeacherCard
                    image={teacher.image}
                    name={teacher.name}
                    teaches={teacher.teaches}
                    speaks={teacher.speaks}
                  />
                </div>
              ))}
            </div>

            {/* Flecha derecha */}
            <button 
              onClick={() => scroll("right")} 
              className="btn btn-outline-secondary rounded-circle ms-3 d-none d-md-flex align-items-center justify-content-center"
              style={{ width: "50px", height: "50px", flexShrink: 0 }}
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Botones móvil */}
          <div className="d-flex justify-content-center mt-4 d-md-none gap-3">
            <button 
              onClick={() => scroll("left")} 
              className="btn btn-outline-secondary rounded-circle"
              style={{ width: "50px", height: "50px" }}
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={() => scroll("right")} 
              className="btn btn-outline-secondary rounded-circle"
              style={{ width: "50px", height: "50px" }}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Teachers;