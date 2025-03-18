import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={isAdmin() ? "/students" : "/attendance"}>
          Sistema de Gestión Escolar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAdmin() && (
              <>
                <Nav.Link as={Link} to="/users">Usuarios</Nav.Link>
                <Nav.Link as={Link} to="/students">Estudiantes</Nav.Link>
                <Nav.Link as={Link} to="/teachers">Profesores</Nav.Link>
                <Nav.Link as={Link} to="/classes">Clases</Nav.Link>
                <Nav.Link as={Link} to="/schedules">Horarios</Nav.Link>
              </>
            )}
            <Nav.Link as={Link} to="/attendance">Asistencia</Nav.Link>
          </Nav>
          <Nav>
            <span className="navbar-text me-3">
              {user.email} ({user.role})
            </span>
            <Button variant="outline-light" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation; 