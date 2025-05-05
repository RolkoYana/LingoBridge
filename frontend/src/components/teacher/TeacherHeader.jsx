import React from "react";
import { Navbar, Form, FormControl } from "react-bootstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";

const TeacherHeader = () => {
  return (
    <Navbar bg="light" className="p-3">
      <Form className="d-flex w-75">
        <FormControl type="search" placeholder="Buscar..." className="me-2" />
      </Form>
      <div className="d-flex align-items-center">
        <FaBell size={24} className="me-3 text-dark" />
        <FaUserCircle size={30} className="text-dark" />
      </div>
    </Navbar>
  );
};

export default TeacherHeader;
