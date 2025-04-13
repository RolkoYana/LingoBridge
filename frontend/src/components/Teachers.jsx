import React, { useState } from "react";
import TeacherCard from "./TeacherCard";
import imgPilar from "../assets/teachers/Pilar_espaniol.jpg";
import imgDaniel from "../assets/teachers/Daniel_aleman.jpg";
import imgSophie from "../assets/teachers/Sophie_frances.jpg";
import imgAlex from "../assets/teachers/Alex_ingles.jpg";
import imgGabriel from "../assets/teachers/Gabriel_frances.jpg";
import imgAna from "../assets/teachers/Anna_ingles.jpg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const teachers = [
  {
    name: "Pilar",
    teaches: "Español",
    speaks: "Español, Inglés",
    image: imgPilar,
  },
  {
    name: "Daniel",
    teaches: "Alemán",
    speaks: "Alemán, Inglés",
    image: imgDaniel,
  },
  {
    name: "Alex",
    teaches: "Inglés",
    speaks: "Inglés, Español",
    image: imgAlex,
  },
  {
    name: "Sophie",
    teaches: "Francés",
    speaks: "Francés, Inglés",
    image: imgSophie,
  },
  { name: "Anna", teaches: "Inglés", speaks: "Inglés, Español", image: imgAna },
  {
    name: "Gabriel",
    teaches: "Francés",
    speaks: "Francés, Inglés",
    image: imgGabriel,
  },
];

const Teachers = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

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

  console.log("teachers:", teachers);
  console.log("visible:", getVisibleTeachers());

  return (
    <section className="container bg-light">
      <h2 className="text-center mb-4">Conoce a nuestros profesores</h2>

      <div className="position-relative">
        {/* Flecha izquierda */}
        <button
          className="btn btn-outline-secondary position-absolute top-50 start-0 translate-middle-y"
          onClick={() => scroll("left")}
          style={{ zIndex: 1, width: "40px", height: "40px" }}
        >
          <FaChevronLeft size={16} />
        </button>

        {/* Tarjetas centradas */}
        <div className="d-flex justify-content-center gap-4">
          {getVisibleTeachers().map((t, i) =>
            t ? (
              <TeacherCard
                key={i}
                image={t.image}
                name={t.name}
                teaches={t.teaches}
                speaks={t.speaks}
              />
            ) : null
          )}
        </div>

        {/* Flecha derecha */}
        <button
          className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y"
          onClick={() => scroll("right")}
          style={{ zIndex: 1, width: "40px", height: "40px" }}
        >
          <FaChevronRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default Teachers;
