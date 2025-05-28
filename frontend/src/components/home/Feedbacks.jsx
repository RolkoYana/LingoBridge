import React from "react";
import imgNoel from "../../assets/feedbacks/noel.jpg";
import imgJulia from "../../assets/feedbacks/julia.jpg";
import imgNatalia from "../../assets/feedbacks/natalia.jpg";
import { FaStar } from "react-icons/fa"; // Importar el icono de estrella

const Feedbacks = () => {
  const opinions = [
    {
      name: "Noel Salazar",
      text: "Me encantaron las clases, fueron dinámicas y fáciles de seguir.",
      image: imgNoel,
      rating: 5, // Añadir un rating numérico
    },
    {
      name: "Julia Gomez",
      text: "El profesor fue muy paciente y me ayudó a mejorar mi nivel de idioma rápidamente.",
      image: imgJulia,
      rating: 5,
    },
    {
      name: "Natalia Lopez",
      text: "Recomiendo este curso a cualquiera que quiera aprender un idioma!",
      image: imgNatalia,
      rating: 5,
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} className="text-warning" />); // Estrellas llenas
      } else {
        stars.push(<FaStar key={i} className="text-muted" />); // Estrellas vacías o semivacías (opcional)
      }
    }
    return stars;
  };

  return (
    <section className="py-5"> {/* Eliminado bg-light */}
      <div className="container">
        <h2 className="text-center mb-5 display-5 fw-bold">Opiniones de nuestros estudiantes</h2>
        <div className="row justify-content-center">
          {opinions.map((opinion, i) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={i}> {/* Mejorar responsividad */}
              <div className="card h-100 shadow-sm p-4 d-flex flex-column border-0"> {/* Añadir border-0 */}
                <p className="mb-4 fst-italic text-center text-md-start">"{opinion.text}"</p> {/* Texto en cursiva y alineación */}

                <div className="d-flex align-items-center mt-auto"> {/* mt-auto para empujar al final */}
                  <img
                    src={opinion.image}
                    alt={opinion.name}
                    className="rounded-circle me-3 border border-primary" // Borde en la imagen
                    width="60" // Un poco más grande
                    height="60" // Un poco más grande
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <strong className="d-block mb-1">{opinion.name}</strong>
                    <div>{renderStars(opinion.rating)}</div>
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