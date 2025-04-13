import React from "react";

const Faq = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Preguntas frecuentes</h2>

        <div className="accordion" id="faqAccordion">
          {/* Pregunta 1 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                ¿Qué material didáctico voy a recibir?
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body text-start">
                Recibirás libros digitales, fichas de vocabulario, acceso a la
                plataforma online y ejercicios interactivos.
              </div>
            </div>
          </div>

          {/* Pregunta 2 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                ¿Qué herramienta necesito utilizar para conectarme a una clase?
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body text-start">
                Solo necesitas una conexión a Internet y una cuenta gratuita de
                Zoom o Google Meet.
              </div>
            </div>
          </div>

          {/* Pregunta 3 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                ¿Hasta qué nivel puedo aprender?
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body text-start">
                Puedes avanzar desde nivel principiante (A1) hasta nivel
                avanzado (C2), según tu ritmo.
              </div>
            </div>
          </div>

          {/* Pregunta 4 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingFour">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                ¿Tengo que ajustarme a un horario de clases?
              </button>
            </h2>
            <div
              id="collapseFour"
              className="accordion-collapse collapse"
              aria-labelledby="headingFour"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body text-start">
                Puedes elegir entre clases con horario fijo o flexibles según tu
                disponibilidad.
              </div>
            </div>
          </div>
        </div>

        {/* Botón final */}
        <div className="text-start mt-4">
          <button className="btn btn-primary">Leer más FAQ</button>
        </div>
      </div>
    </section>
  );
};

export default Faq;
