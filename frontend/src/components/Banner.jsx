import React from "react";
import logo from "../assets/banner.jpg";

const Banner = () => {
  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Texto a la izquierda */}
          <div className="col-md-6">
            <h1 className="mb-4">¡Aprende idiomas desde cualquier lugar!</h1>
            <p className="mb-4">
              Descubre nuestros cursos flexibles, intensivos y en grupo.
              ¡Empieza tu aventura lingüística hoy mismo!
            </p>
            <button className="btn btn-primary">Ver cursos</button>
          </div>

          {/* Imagen a la derecha */}
          <div className="col-md-6 text-center">
            <img
              src={logo}
              alt="Imagen del banner"
              className="img-fluid"
              style={{ maxHeight: "300px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
