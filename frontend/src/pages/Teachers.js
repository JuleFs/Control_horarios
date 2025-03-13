// pages/Teachers.js - Página de gestión de profesores
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import API from '../services/api';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await API.getAllTeachers();
      setTeachers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar profesores');
      setLoading(false);
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher({ ...newTeacher, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.createTeacher(newTeacher);
      setNewTeacher({ name: '', email: '' });
      setMessage({ type: 'success', text: 'Profesor creado con éxito' });
      fetchTeachers();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error al crear profesor' });
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Gestión de Profesores</h1>
      
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      <Row className="mb-4">
        <Col lg={5}>
          <Card>
            <Card.Header>Registrar Nuevo Profesor</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newTeacher.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={newTeacher.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Registrar</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7}>
          <Card>
            <Card.Header>Lista de Profesores</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Cargando profesores...</p>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.length > 0 ? (
                      teachers.map(teacher => (
                        <tr key={teacher.id}>
                          <td>{teacher.id}</td>
                          <td>{teacher.name}</td>
                          <td>{teacher.email}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">No hay profesores registrados</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Teachers;
