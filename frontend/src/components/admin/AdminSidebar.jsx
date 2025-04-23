import React from 'react'
import {Nav} from 'react-bootstrap'

const AdminSidebar = () => {
  return (
    <Nav className='flex-column text-center mt-4'>
        <Nav.Link href='#' className='text-white my-2'>Inicio</Nav.Link>
        <Nav.Link href='#users' className='text-white my-2'>Usuarios</Nav.Link>
        <Nav.Link href='#courses' className='text-white my-2'>Cursos</Nav.Link>
        <Nav.Link href='#stats' className='text-white my-2'>Estadísticas</Nav.Link>
    </Nav>
  )
}

export default AdminSidebar