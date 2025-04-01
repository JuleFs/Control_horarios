import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student',
    phone: ''
  });
  const { user } = useAuth();

  // Cargar los datos iniciales
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, studentsRes, teachersRes] = await Promise.all([
        API.getUsers(),
        API.getAllStudents(),
        API.getAllTeachers()
      ]);
      
      setUsers(usersRes.data);
      setStudents(studentsRes.data);
      setTeachers(teachersRes.data);
      setError('');
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.createUser(formData);
      setShowModal(false);
      setSuccess('Usuario registrado exitosamente');
      setFormData({
        email: '',
        password: '',
        name: '',
        role: 'student',
        phone: ''
      });
      // Recargar todos los datos para mostrar los cambios
      await loadAllData();
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setError('Error al registrar el usuario: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Buscar el estudiante o profesor asociado a un usuario
  const findAssociatedEntity = (userEmail, role) => {
    if (role === 'student') {
      return students.find(student => student.email === userEmail);
    } else if (role === 'teacher') {
      return teachers.find(teacher => teacher.email === userEmail);
    }
    return null;
  };

  if (!user || user.role !== 'admin') {
    return (
      <Container>
        <Alert variant="danger">
          No tienes permisos para acceder a esta página.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Registrar Nuevo Usuario
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Alert variant="info">Cargando datos...</Alert>
      ) : (
        <Row>
          <Col>
            <h4>Usuarios del Sistema</h4>
            <Table striped bordered hover className="mb-4">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Información Asociada</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map(user => {
                    const associatedEntity = findAssociatedEntity(user.email, user.role);
                    return (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role === 'admin' ? 'Administrador' : 
                             user.role === 'teacher' ? 'Profesor' : 'Estudiante'}</td>
                        <td>
                          {user.role === 'admin' ? 'N/A' : 
                            associatedEntity ? 
                              `ID: ${associatedEntity.id}` : 
                              'No asociado'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No hay usuarios registrados</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Nuevo Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Opcional"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="student">Estudiante</option>
                <option value="teacher">Profesor</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrar Usuario'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Users;