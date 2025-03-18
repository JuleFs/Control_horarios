import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card, Alert, Modal } from 'react-bootstrap';
import API from '../services/api';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newClass, setNewClass] = useState({ name: '', teacher: { id: '' } });
  const [message, setMessage] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesResponse, teachersResponse] = await Promise.all([
        API.getAllClasses(),
        API.getAllTeachers()
      ]);
      
      setClasses(classesResponse.data);
      setTeachers(teachersResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar datos');
      setLoading(false);
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'teacherId') {
      if (editingClass) {
        setEditingClass({ ...editingClass, teacher: { id: parseInt(value) } });
      } else {
        setNewClass({ ...newClass, teacher: { id: parseInt(value) } });
      }
    } else {
      if (editingClass) {
        setEditingClass({ ...editingClass, [name]: value });
      } else {
        setNewClass({ ...newClass, [name]: value });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.createClass(newClass);
      setNewClass({ name: '', teacher: { id: '' } });
      setMessage({ type: 'success', text: 'Clase creada con éxito' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error al crear clase' });
      console.error(err);
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.updateClass(editingClass.id, editingClass);
      setMessage({ type: 'success', text: 'Clase actualizada con éxito' });
      setShowEditModal(false);
      setEditingClass(null);
      fetchData();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error al actualizar clase' });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
      try {
        await API.deleteClass(id);
        setMessage({ type: 'success', text: 'Clase eliminada con éxito' });
        fetchData();
      } catch (err) {
        setMessage({ type: 'danger', text: 'Error al eliminar clase' });
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="mb-4">Gestión de Clases</h1>
      
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      <Row className="mb-4">
        <Col lg={5}>
          <Card>
            <Card.Header>Registrar Nueva Clase</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de la clase</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newClass.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Profesor</Form.Label>
                  <Form.Select
                    name="teacherId"
                    value={newClass.teacher.id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar profesor</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit">Registrar</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7}>
          <Card>
            <Card.Header>Lista de Clases</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Cargando clases...</p>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre de la Clase</th>
                      <th>Profesor</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.length > 0 ? (
                      classes.map(classItem => (
                        <tr key={classItem.id}>
                          <td>{classItem.id}</td>
                          <td>{classItem.name}</td>
                          <td>{classItem.teacher ? classItem.teacher.name : 'No asignado'}</td>
                          <td>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(classItem)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(classItem.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No hay clases registradas</td>
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
          <Modal.Title>Editar Clase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la clase</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editingClass?.name || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profesor</Form.Label>
              <Form.Select
                name="teacherId"
                value={editingClass?.teacher?.id || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar profesor</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </Form.Select>
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

export default Classes;