import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import logo from "../../assets/logo.jpg";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import "./Navbar.css"

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation(); 
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-white"
      } py-3`}
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" height="60" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link fs-5 px-3 ${
                  location.pathname === "/quienes-somos" ? "active" : ""
                }`} 
                to="/quienes-somos"
              >
                Quiénes somos
              </Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className={`nav-link dropdown-toggle fs-5 px-3 ${
                  location.pathname.startsWith("/idiomas") ? "active" : ""
                }`}
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
                className={`nav-link dropdown-toggle fs-5 px-3 ${
                  location.pathname.startsWith("/cursos") ? "active" : ""
                }`}
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
              <Link 
                className={`nav-link fs-5 px-3 ${
                  location.pathname === "/trabajo-con-nosotros" ? "active" : ""
                }`} 
                to="/trabajo-con-nosotros"
              >
                Trabaja con nosotros
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <Link to="/login" className="btn btn-outline-primary me-2 px-3 py-2">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn btn-primary px-3 py-2 me-3">
              Registrarse
            </Link>
            
            {/* Botón de modo oscuro */}
            <button
              onClick={toggleTheme}
              className="btn border-0 bg-transparent p-2"
              title="Cambiar modo"
              aria-label="Cambiar modo de tema"
            >
              {theme === "dark" ? (
                <FaSun className="text-warning fs-4" />
              ) : (
                <FaMoon className="text-dark fs-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;