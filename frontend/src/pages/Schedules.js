import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card, Alert, Modal } from 'react-bootstrap';
import API from '../services/api';

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    studentId: '',
    subject: '',
    day: '',
    startTime: '',
    endTime: ''
  });
  const [message, setMessage] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedulesResponse, studentsResponse] = await Promise.all([
        API.getAllSchedules(),
        API.getAllStudents()
      ]);
      
      setSchedules(schedulesResponse.data);
      setStudents(studentsResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar datos');
      setLoading(false);
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingSchedule) {
      setEditingSchedule({ ...editingSchedule, [name]: value });
    } else {
      setNewSchedule({ ...newSchedule, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scheduleToSave = {
        ...newSchedule,
        studentId: parseInt(newSchedule.studentId)
      };
      
      await API.createSchedule(scheduleToSave);
      setNewSchedule({
        studentId: '',
        subject: '',
        day: '',
        startTime: '',
        endTime: ''
      });
      setMessage({ type: 'success', text: 'Horario creado con éxito' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error al crear horario' });
      console.error(err);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule({
      ...schedule,
      studentId: schedule.studentId.toString()
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const scheduleToUpdate = {
        ...editingSchedule,
        studentId: parseInt(editingSchedule.studentId)
      };
      await API.updateSchedule(editingSchedule.id, scheduleToUpdate);
      setMessage({ type: 'success', text: 'Horario actualizado con éxito' });
      setShowEditModal(false);
      setEditingSchedule(null);
      fetchData();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error al actualizar horario' });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      try {
        await API.deleteSchedule(id);
        setMessage({ type: 'success', text: 'Horario eliminado con éxito' });
        fetchData();
      } catch (err) {
        setMessage({ type: 'danger', text: 'Error al eliminar horario' });
        console.error(err);
      }
    }
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div>
      <h1 className="mb-4">Gestión de Horarios</h1>
      
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      <Row className="mb-4">
        <Col lg={5}>
          <Card>
            <Card.Header>Registrar Nuevo Horario</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Estudiante</Form.Label>
                  <Form.Select
                    name="studentId"
                    value={newSchedule.studentId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar estudiante</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Asignatura</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={newSchedule.subject}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Día</Form.Label>
                  <Form.Select
                    name="day"
                    value={newSchedule.day}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar día</option>
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Hora de inicio</Form.Label>
                      <Form.Control
                        type="time"
                        name="startTime"
                        value={newSchedule.startTime}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Hora de fin</Form.Label>
                      <Form.Control
                        type="time"
                        name="endTime"
                        value={newSchedule.endTime}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit">Registrar</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7}>
          <Card>
            <Card.Header>Lista de Horarios</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Cargando horarios...</p>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Estudiante</th>
                      <th>Asignatura</th>
                      <th>Día</th>
                      <th>Hora inicio</th>
                      <th>Hora fin</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.length > 0 ? (
                      schedules.map(schedule => (
                        <tr key={schedule.id}>
                          <td>{schedule.id}</td>
                          <td>{students.find(s => s.id === schedule.studentId)?.name || schedule.studentId}</td>
                          <td>{schedule.subject}</td>
                          <td>{schedule.day}</td>
                          <td>{schedule.startTime}</td>
                          <td>{schedule.endTime}</td>
                          <td>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(schedule)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(schedule.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">No hay horarios registrados</td>
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
          <Modal.Title>Editar Horario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Estudiante</Form.Label>
              <Form.Select
                name="studentId"
                value={editingSchedule?.studentId || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar estudiante</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Asignatura</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={editingSchedule?.subject || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Día</Form.Label>
              <Form.Select
                name="day"
                value={editingSchedule?.day || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar día</option>
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Hora de inicio</Form.Label>
                  <Form.Control
                    type="time"
                    name="startTime"
                    value={editingSchedule?.startTime || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Hora de fin</Form.Label>
                  <Form.Control
                    type="time"
                    name="endTime"
                    value={editingSchedule?.endTime || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
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

export default Schedules;