import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

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
    }
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

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este profesor? Esta acción también eliminará el usuario asociado.')) {
      try {
        await API.deleteTeacher(id);
        setMessage({ type: 'success', text: 'Profesor y usuario asociado eliminados con éxito' });
        fetchTeachers();
      } catch (err) {
        setMessage({ type: 'danger', text: 'Error al eliminar profesor' });
        console.error(err);
      }
    }
  };

  const navigateToUserRegistration = () => {
    navigate('/users');
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
        <Col>
          <Card className="mb-4">
            <Card.Header>Información</Card.Header>
            <Card.Body>
              <p>
                Los profesores ahora se registran a través del módulo de Usuarios.
                Para registrar un nuevo profesor, por favor vaya a la sección de Usuarios
                y cree un nuevo usuario con el rol de "Profesor".
              </p>
              <Button variant="primary" onClick={navigateToUserRegistration}>
                Ir a Gestión de Usuarios
              </Button>
            </Card.Body>
          </Card>
          
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
                      <th>Teléfono</th>
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
                          <td>{teacher.phone || 'N/A'}</td>
                          <td>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(teacher)}
                            >
                              Editar
                            </Button>
                            {isAdmin() && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(teacher.id)}
                              >
                                Eliminar
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No hay profesores registrados</td>
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
              <Form.Label>Correo electrónico (no editable)</Form.Label>
              <Form.Control
                type="email"
                value={editingTeacher?.email || ''}
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
                value={editingTeacher?.phone || ''}
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

export default Teachers;