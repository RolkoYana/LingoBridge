import React, { useState } from "react";
import TeacherCard from "./home/TeacherCard";
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

  // Determinar el número de profesores visibles basado en el tamaño de la pantalla
  const getVisibleCount = () => {
    if (window.innerWidth < 768) return 1; // Móvil
    if (window.innerWidth < 992) return 2; // Tablet
    return 3; // Desktop
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  // Actualizar visibleCount en el cambio de tamaño de ventana
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
    <section className="py-5"> {/* Eliminado bg-light */}
      <div className="container">
        <h2 className="text-center mb-5 display-5 fw-bold">Conoce a nuestros profesores</h2>

        <div className="position-relative d-flex align-items-center justify-content-center"> {/* Centrar contenido y botones */}
          {/* Flecha izquierda */}
          <button
            className="btn btn-outline-secondary rounded-circle me-3 d-none d-md-block" // Ocultar en móvil, redondo
            onClick={() => scroll("left")}
            style={{ width: "45px", height: "45px", flexShrink: 0 }} // Ajustar tamaño y evitar encogimiento
            aria-label="Profesor anterior"
          >
            <FaChevronLeft />
          </button>

          {/* Tarjetas de profesores */}
          <div className="d-flex justify-content-center gap-4 overflow-hidden" style={{ flexGrow: 1 }}> {/* overflow-hidden para deslizar si es necesario */}
            {getVisibleTeachers().map((t, i) =>
              t ? (
                <div key={i} className="flex-shrink-0" style={{ width: `${100 / visibleCount - 2}%`, maxWidth: '300px' }}> {/* Ancho dinámico para adaptarse */}
                  <TeacherCard
                    image={t.image}
                    name={t.name}
                    teaches={t.teaches}
                    speaks={t.speaks}
                  />
                </div>
              ) : null
            )}
          </div>

          {/* Flecha derecha */}
          <button
            className="btn btn-outline-secondary rounded-circle ms-3 d-none d-md-block" // Ocultar en móvil, redondo
            onClick={() => scroll("right")}
            style={{ width: "45px", height: "45px", flexShrink: 0 }} // Ajustar tamaño y evitar encogimiento
            aria-label="Profesor siguiente"
          >
            <FaChevronRight />
          </button>
        </div>
        {/* Botones de navegación para móviles */}
        <div className="d-flex justify-content-center mt-4 d-md-none gap-3">
          <button
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => scroll("left")}
            style={{ width: "45px", height: "45px" }}
            aria-label="Profesor anterior"
          >
            <FaChevronLeft />
          </button>
          <button
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => scroll("right")}
            style={{ width: "45px", height: "45px" }}
            aria-label="Profesor siguiente"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Teachers;