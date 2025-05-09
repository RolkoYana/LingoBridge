import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import logo from "../assets/logo.jpg";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-white");
  };

  // comprueba si el usuario esta logueado
  const isLoggedIn = !!localStorage.getItem("token");

  // logout + eliminar el token del almacenamiento local y redirige al usuario al inicio o login
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // eliminar el token JWT
    localStorage.removeItem("user"); // elimina la info del usuario
    navigate("/");
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-white"
      } py-2`}
    >
      <div className="container">
        <a className="navbar-brand" href="#">
          <img src={logo} alt="Logo" height="40" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Quiénes somos
              </a>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="idiomasDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                Idiomas
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Inglés
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Español
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Alemán
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Francés
                  </a>
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
              >
                Cursos
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Intensivo
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Flexible
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Grupal
                  </a>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                Trabajo con nosotros
              </a>
            </li>
          </ul>

          {/* Botones de iniciar sesión y registrarse */}
          {isLoggedIn ? (
            <button className="btn btn-danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
          ) : (
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-primary me-2">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn btn-primary">
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* Botón de modo oscuro */}
        <button
          onClick={toggleTheme}
          className="btn border-0 bg-transparent ms-3"
          title="Cambiar modo"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
