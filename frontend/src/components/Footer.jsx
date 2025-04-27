import React from 'react'
import { FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-dark pt-5 border-top">
      <div className="container">
        <div className="row text-start">
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Empresa</h6>
            <ul className="list-unstyled">
              <li><a href="#">Sobre nosotros</a></li>
              <li><a href="#">Ofertas de trabajo</a></li>
              <li><a href="#">Opiniones</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Idioma</h6>
            <ul className="list-unstyled">
              <li><a href="#">Español</a></li>
              <li><a href="#">Inglés</a></li>
              <li><a href="#">Alemán</a></li>
              <li><a href="#">Francés</a></li>
            </ul>
          </div>

          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Contacto</h6>
            <ul className="list-unstyled">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contáctanos</a></li>
            </ul>
          </div>

          <div className="col-md-6 mb-4">
            <h6 className="fw-bold">Suscríbete a nuestro boletín electrónico</h6>
            <form className="d-flex mb-2">
              <input
                type="email"
                className="form-control me-2"
                placeholder="Correo electrónico"
              />
              <button className="btn btn-primary" type="submit">Enviar</button>
            </form>
            <p className="small text-muted">
              Al hacer clic en “Enviar”, acepta recibir correos electrónicos sobre las últimas noticias y ofertas especiales. Puede darse de baja en cualquier momento.
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-3 border-top pb-3">
          <p className="mb-0 text-muted">© 2025 LingoBridge | <a href="#">Privacidad</a> | <a href="#">Términos</a></p>
          <div className="d-flex gap-3">
            <a href="#" className="text-dark"><FaInstagram /></a>
            <a href="#" className="text-dark"><FaYoutube /></a>
            <a href="#" className="text-dark"><FaTwitter /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer