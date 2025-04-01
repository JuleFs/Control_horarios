import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingStudent) {
      setEditingStudent({ ...editingStudent, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.updateStudent(editingStudent.id, editingStudent);
      setMessage({ type: 'success', text: 'Estudiante actualizado con éxito' });
      setShowEditModal(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error al actualizar estudiante' });
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante? Esta acción también eliminará el usuario asociado.')) {
      try {
        await API.deleteStudent(id);
        setMessage({ type: 'success', text: 'Estudiante y usuario asociado eliminados con éxito' });
        fetchStudents();
      } catch (err) {
        setMessage({ type: 'danger', text: 'Error al eliminar estudiante' });
        console.error(err);
      }
    }
  };

  const navigateToUserRegistration = () => {
    navigate('/users');
  };

  return (
    <div>
      <h1 className="mb-4">Gestión de Estudiantes</h1>
      
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <Card className="mb-4">
            <Card.Header>Información</Card.Header>
            <Card.Body>
              <p>
                Los estudiantes ahora se registran a través del módulo de Usuarios.
                Para registrar un nuevo estudiante, por favor vaya a la sección de Usuarios
                y cree un nuevo usuario con el rol de "Estudiante".
              </p>
              <Button variant="primary" onClick={navigateToUserRegistration}>
                Ir a Gestión de Usuarios
              </Button>
            </Card.Body>
          </Card>
          
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
                          <td>{student.phone || 'N/A'}</td>
                          <td>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(student)}
                            >
                              Editar
                            </Button>
                            {isAdmin() && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(student.id)}
                              >
                                Eliminar
                              </Button>
                            )}
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
        </Col>
      </Row>

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
              <Form.Label>Correo electrónico (no editable)</Form.Label>
              <Form.Control
                type="email"
                value={editingStudent?.email || ''}
                disabled
              />
              <Form.Text className="text-muted">
                El correo electrónico no se puede editar ya que está vinculado al usuario del sistema.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={editingStudent?.phone || ''}
                onChange={handleInputChange}
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

export default Students;