import React from "react";
import bannerImage from "../assets/banner.jpg"; // Renombrado de 'logo' a 'bannerImage' para claridad

const Banner = () => {
  return (
    <section className="py-5"> {/* Eliminado bg-light, se manejará con CSS global */}
      <div className="container">
        <div className="row align-items-center flex-column-reverse flex-md-row"> {/* Añadido flex-column-reverse para móvil */}
          {/* Texto a la izquierda */}
          <div className="col-md-6 text-center text-md-start mb-4 mb-md-0"> {/* Ajustes de texto y margen para móvil */}
            <h1 className="display-4 fw-bold mb-3">¡Aprende idiomas desde cualquier lugar!</h1> {/* Título más grande y bold */}
            <p className="lead mb-4"> {/* Párrafo con estilo más grande */}
              Descubre nuestros cursos flexibles, intensivos y en grupo.
              ¡Empieza tu aventura lingüística hoy mismo!
            </p>
            <button className="btn btn-primary btn-lg">Ver cursos</button> {/* Botón más grande */}
          </div>

          {/* Imagen a la derecha */}
          <div className="col-md-6 text-center">
            <img
              src={bannerImage}
              alt="Personas aprendiendo idiomas" // Mejorar alt text
              className="img-fluid rounded shadow-lg" // Clases de Bootstrap para estilo
              style={{ maxHeight: "350px", objectFit: "cover", width: "100%" }} // Ajustar max-height, object-fit
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;