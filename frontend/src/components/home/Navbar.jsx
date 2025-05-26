import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import logo from "../../assets/logo.jpg";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx"; // Importa el hook del contexto

const Navbar = () => {
  const { theme, toggleTheme } = useTheme(); // Usa el hook para obtener el tema y la función toggle

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-white"
      } py-2`}
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          {" "}
          {/* Usar Link para navegación interna */}
          <img src={logo} alt="Logo" height="40" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown" // Mejorar accesibilidad
          aria-expanded="false" // Mejorar accesibilidad
          aria-label="Toggle navigation" // Mejorar accesibilidad
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/quienes-somos">
                Quiénes somos
              </Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="idiomasDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Idiomas
              </a>
              <ul className="dropdown-menu" aria-labelledby="idiomasDropdown">
                <li>
                  <Link className="dropdown-item" to="/idiomas/ingles">
                    Inglés
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/idiomas/espanol">
                    Español
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/idiomas/aleman">
                    Alemán
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/idiomas/frances">
                    Francés
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="cursosDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Cursos
              </a>
              <ul className="dropdown-menu" aria-labelledby="cursosDropdown">
                <li>
                  <Link className="dropdown-item" to="/cursos/intensivo">
                    Intensivo
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/cursos/flexible">
                    Flexible
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/cursos/grupal">
                    Grupal
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/trabajo-con-nosotros">
                Trabajo con nosotros
              </Link>
            </li>
          </ul>

          <div className="d-flex">
            <Link to="/login" className="btn btn-outline-primary me-2">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn btn-primary">
              Registrarse
            </Link>
          </div>
        </div>

        {/* Botón de modo oscuro */}
        <button
          onClick={toggleTheme}
          className="btn border-0 bg-transparent ms-3"
          title="Cambiar modo"
          aria-label="Cambiar modo de tema" // Mejorar accesibilidad
        >
          {theme === "dark" ? (
            <FaSun className="text-warning" />
          ) : (
            <FaMoon className="text-dark" />
          )}{" "}
          {/* Iconos con color que contrasta */}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
