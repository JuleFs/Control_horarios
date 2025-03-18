import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Unauthorized() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleRedirect = () => {
    if (isAdmin()) {
      navigate('/students');
    } else {
      navigate('/attendance');
    }
  };

  return (
    <Container className="mt-5">
      <Alert variant="danger">
        <Alert.Heading>Acceso No Autorizado</Alert.Heading>
        <p>
          Lo sentimos, no tienes permisos para acceder a esta página. 
          Si crees que esto es un error, por favor contacta al administrador del sistema.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button variant="outline-danger" onClick={handleRedirect}>
            Volver a la página principal
          </Button>
        </div>
      </Alert>
    </Container>
  );
}

export default Unauthorized; 