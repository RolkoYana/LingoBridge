import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { FaAngleDown } from "react-icons/fa";

const TeacherSidebar = () => {
  const [showCourses, setShowCourses] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.roles.includes("TEACHER") && user.courses) {
      setCourses(user.courses);
    }
  }, []);

  return (
    <Nav className="flex-column text-center mt-4">
      <Nav.Link href="#" className="text-white">
        Cambiar modo
      </Nav.Link>
      {/* Mis Cursos con menú desplegable */}
      <Nav.Link
        onClick={() => setShowCourses(!showCourses)}
        className="text-white"
        style={{ cursor: "pointer" }}
      >
        Mis cursos <FaAngleDown className="ms-2" />
      </Nav.Link>
      {showCourses &&
        courses.map((course) => (
          <Nav.Link
            key={course.id}
            href={`/teacher/course/${course.id}`}
            className="text-white ps-4"
          >
            {course.name}
          </Nav.Link>
        ))}
      <Nav.Link href="#" className="text-white">
        Material
      </Nav.Link>
      <Nav.Link href="#" className="text-white">
        Evaluaciones
      </Nav.Link>
      <Nav.Link href="#" className="text-white">
        Mensajes
      </Nav.Link>
      <Nav.Link href="#" className="text-white">
        Ajustes
      </Nav.Link>
    </Nav>
  );
};

export default TeacherSidebar;
