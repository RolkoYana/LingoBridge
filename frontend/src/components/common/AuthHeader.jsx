import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import "../../styles/AuthHeader.css";

const AuthHeader = ({ prompt, linkText, linkTo }) => {
  return (
    <Container fluid className="auth-header-container px-0">
      <Row className="auth-header-row w-100 px-3 py-2 align-self-start">
        <Col xs="auto" className="d-flex align-items-center">
          <Link to="/">
            <img
              src={logo}
              alt="LingoBridge Logo"
              height="60"
              style={{ cursor: "pointer" }}
            />
          </Link>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <span className="text-secondary-themed">
            {prompt}{" "}
            <Link
              to={linkTo}
              className="link-themed text-decoration-none fw-bold"
            >
              {linkText}
            </Link>
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthHeader;
