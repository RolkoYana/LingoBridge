import React from "react";
import bannerImage from "../../assets/banner.jpg"; 
import "./Banner.css";

const Banner = () => {
  return (
    <div className="banner">
      <section className="py-5"> 
        <div className="container">
          <div className="row align-items-center flex-column-reverse flex-md-row"> 
            <div className="col-md-6 text-center text-md-start mb-4 mb-md-0"> 
              <h1 className="display-4 fw-bold mb-3">¡Aprende idiomas desde cualquier lugar!</h1> 
              <p className="lead mb-4"> 
                Descubre nuestros cursos flexibles, intensivos y en grupo.
                ¡Empieza tu aventura lingüística hoy mismo!
              </p>
              <button className="btn btn-primary btn-lg">Ver cursos</button> 
            </div>
            <div className="col-md-6 text-center">
              <img
                src={bannerImage}
                alt="Personas aprendiendo idiomas"
                className="img-fluid rounded shadow-lg" 
                style={{ maxHeight: "350px", objectFit: "cover", width: "100%" }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;