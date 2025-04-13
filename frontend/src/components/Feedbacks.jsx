import React from "react";
import imgNoel from "../assets/feedbacks/noel.jpg";
import imgJulia from "../assets/feedbacks/julia.jpg";
import imgNatalia from "../assets/feedbacks/natalia.jpg";

const Feedbacks = () => {
  const opinions = [
    {
      name: "Noel Salazar",
      text: "Me encantaron las clases, fueroon dinámicas y fáciles de seguir.",
      image: imgNoel,
    },
    {
      name: "Julia Gomez",
      text: "El profesor fue muy paciente y me ayudó a mejorar mi nivel de idioma rápidamente.",
      image: imgJulia,
    },
    {
      name: "Natalia Lopez",
      text: "Recomiendo este curso a cualquiera que quiera aprender un idioma!",
      image: imgNatalia,
    },
  ];

  return (
    <section className="bg-light py-5">
      <div className="container">
        <h2 className="text-center mb-4">Opiniones de nuestros estudiantes</h2>
        <div className="row">
          {opinions.map((opinion, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <div className="card h-100 shadow-sm p-4 d-flex flex-column justify-content-between">
                <p className="mb-4">"{opinion.text}"</p>

                <div className="d-flex align-items-center justify-content-center">
                  <img
                    src={opinion.image}
                    alt={opinion.name}
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                  />
                  <div>
                    <strong className="d-block">{opinion.name}</strong>
                    <div style={{ color: "#FFD700" }}>★★★★★</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feedbacks;
