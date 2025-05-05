import React, {useState, useEffect} from "react";
import { Nav } from "react-bootstrap";
import { FaAngleDown } from "react-icons/fa";

const StudentSidebar = () => {
  const [showCourses, setShowCourses] = useState(false); // para controlar si el menu de cursos esta desplegado o no 
  const [courses, setCourses] = useState([]); // para almacenar los cursos del estudiante

  // obtener los cursos cuando el componente se monta
  useEffect(() =>{
    const user = JSON.parse(localStorage.getItem("user")) // obtener usuario desde localStorage 
    
    if(user && user.roles.includes("STUDENT") && user.courses){
      setCourses(user.courses); // los cursos deben existir en la API de login 
    }
  
  }, []) // [] - hace que el efecto se ejecute solo una vez al montar el componente

  return (
    <Nav className="flex-column text-center mt-4">
      <Nav.Link href="#" className="text-white">
        Inicio
      </Nav.Link>
      {/* enlace "Mis cursos" con la opcion de desplegar */}
      <Nav.Link onClick={() => setShowCourse(!showCourses)} className="text-white" style={{cursor: "pointer"}}>
        Mis cursos <FaAngleDown className="ms-2"/> {/* icono de flecha indicando que es deplegable */}
      </Nav.Link>

      {/* si showCourses = true, se muestran los cursos del estudiantes */}
      {showCourses && courses.map((course) =>(
        <Nav.Link key={course.id} gref={`/student/course/${course.id}`} className="text-white ps-4">
          {course.name}
        </Nav.Link>
      ))}

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

export default StudentSidebar;
