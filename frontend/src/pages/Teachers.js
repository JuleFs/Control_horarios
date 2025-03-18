// pages/Teachers.js - Página de gestión de profesores
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card, Alert, Modal } from 'react-bootstrap';
import API from '../services/api';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '' });
  const [message, setMessage] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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
    if (editingTeacher) {
      setEditingTeacher({ ...editingTeacher, [name]: value });
    } else {
      setNewTeacher({ ...newTeacher, [name]: value });
    }
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

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.updateTeacher(editingTeacher.id, editingTeacher);
      setMessage({ type: 'success', text: 'Profesor actualizado con éxito' });
      setShowEditModal(false);
      setEditingTeacher(null);
      fetchTeachers();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error al actualizar profesor' });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      try {
        await API.deleteTeacher(id);
        setMessage({ type: 'success', text: 'Profesor eliminado con éxito' });
        fetchTeachers();
      } catch (err) {
        setMessage({ type: 'danger', text: 'Error al eliminar profesor' });
        console.error(err);
      }
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
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.length > 0 ? (
                      teachers.map(teacher => (
                        <tr key={teacher.id}>
                          <td>{teacher.id}</td>
                          <td>{teacher.name}</td>
                          <td>{teacher.email}</td>
                          <td>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(teacher)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(teacher.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No hay profesores registrados</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Profesor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editingTeacher?.name || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editingTeacher?.email || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Teachers;
