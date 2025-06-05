import React from 'react'
import { FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import { Link } from 'react-router-dom';
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <footer className="pt-5 border-top"> 
        <div className="container">
          <div className="row text-start">
            <div className="col-12 col-md-2 mb-4"> 
              <h6 className="fw-bold text-uppercase mb-3">Empresa</h6> 
              <ul className="list-unstyled">
                <li><Link to="/sobre-nosotros">Sobre nosotros</Link></li>
                <li><Link to="/ofertas-trabajo">Ofertas de trabajo</Link></li>
                <li><Link to="/opiniones">Opiniones</Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>

            <div className="col-12 col-md-2 mb-4">
              <h6 className="fw-bold text-uppercase mb-3">Idioma</h6>
              <ul className="list-unstyled">
                <li><Link to="/idiomas/espanol">Español</Link></li>
                <li><Link to="/idiomas/ingles">Inglés</Link></li>
                <li><Link to="/idiomas/aleman">Alemán</Link></li>
                <li><Link to="/idiomas/frances">Francés</Link></li>
              </ul>
            </div>

            <div className="col-12 col-md-2 mb-4">
              <h6 className="fw-bold text-uppercase mb-3">Contacto</h6>
              <ul className="list-unstyled">
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/contacto">Contáctanos</Link></li>
              </ul>
            </div>

            <div className="col-12 col-md-6 mb-4">
              <h6 className="fw-bold text-uppercase mb-3">Suscríbete a nuestro boletín</h6>
              <form className="d-flex flex-column flex-sm-row mb-2"> 
                <input
                  type="email"
                  className="form-control me-sm-2 mb-2 mb-sm-0" 
                  placeholder="Correo electrónico"
                  aria-label="Correo electrónico para suscribirse"
                />
                <button className="btn btn-primary flex-shrink-0" type="submit">Enviar</button>
              </form>
              <p className="small">
                Al hacer clic en "Enviar", acepta recibir correos electrónicos sobre las últimas noticias y ofertas especiales. Puede darse de baja en cualquier momento.
              </p>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 border-top pb-3"> 
            <p className="mb-2 mb-md-0 text-muted text-center text-md-start">© 2025 LingoBridge | <Link to="/privacidad">Privacidad</Link> | <Link to="/terminos">Términos</Link></p>
            <div className="d-flex gap-3 mt-2 mt-md-0"> 
              <a href="#" className="text-secondary" aria-label="Síguenos en Instagram"><FaInstagram size={24} /></a> 
              <a href="#" className="text-secondary" aria-label="Síguenos en YouTube"><FaYoutube size={24} /></a>
              <a href="#" className="text-secondary" aria-label="Síguenos en Twitter"><FaTwitter size={24} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;