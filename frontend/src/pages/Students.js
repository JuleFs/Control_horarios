// pages/Students.js - Página de gestión de estudiantes
import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { Table, Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
=======
import { Table, Card, Alert, Button, Modal, Form } from 'react-bootstrap';
>>>>>>> Stashed changes
import API from '../services/api';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< Updated upstream
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });
=======
>>>>>>> Stashed changes
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await API.getAllStudents();
      setStudents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar estudiantes');
      setLoading(false);
      console.error(err);
    }
  };

<<<<<<< Updated upstream
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.createStudent(newStudent);
      setNewStudent({ name: '', email: '' });
      setMessage({ type: 'success', text: 'Estudiante creado con éxito' });
      fetchStudents();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error al crear estudiante' });
      console.error(err);
    }
  };

=======
  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await API.updateStudent(editingStudent.id, editingStudent);
      setMessage({ type: 'success', text: 'Estudiante actualizado con éxito' });
      setShowEditModal(false);
      setEditingStudent(null);
      // Actualizar el estudiante en la lista local
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === editingStudent.id ? response.data : student
        )
      );
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error al actualizar estudiante' });
      console.error('Error al actualizar estudiante:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      try {
        await API.deleteStudent(id);
        setMessage({ type: 'success', text: 'Estudiante eliminado con éxito' });
        // Eliminar el estudiante de la lista local
        setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
      } catch (err) {
        setMessage({ type: 'danger', text: 'Error al eliminar estudiante' });
        console.error('Error al eliminar estudiante:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

>>>>>>> Stashed changes
  return (
    <div>
      <h1 className="mb-4">Lista de Estudiantes</h1>
      
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

<<<<<<< Updated upstream
      <Row className="mb-4">
        <Col lg={5}>
          <Card>
            <Card.Header>Registrar Nuevo Estudiante</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newStudent.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={newStudent.email}
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
            <Card.Header>Lista de Estudiantes</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Cargando estudiantes...</p>
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
                    {students.length > 0 ? (
                      students.map(student => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">No hay estudiantes registrados</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
=======
      <Card>
        <Card.Header>Estudiantes Registrados</Card.Header>
        <Card.Body>
          {loading ? (
            <p>Cargando estudiantes...</p>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(student)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No hay estudiantes registrados</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Estudiante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editingStudent?.name || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editingStudent?.email || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={editingStudent?.phone || ''}
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
>>>>>>> Stashed changes
    </div>
  );
}

export default Students;