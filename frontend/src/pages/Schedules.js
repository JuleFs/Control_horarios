import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
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
    setNewSchedule({ ...newSchedule, [name]: value });
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
                      <th>Estudiante ID</th>
                      <th>Asignatura</th>
                      <th>Día</th>
                      <th>Hora inicio</th>
                      <th>Hora fin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.length > 0 ? (
                      schedules.map(schedule => (
                        <tr key={schedule.id}>
                          <td>{schedule.id}</td>
                          <td>{schedule.studentId}</td>
                          <td>{schedule.subject}</td>
                          <td>{schedule.day}</td>
                          <td>{schedule.startTime}</td>
                          <td>{schedule.endTime}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No hay horarios registrados</td>
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

export default Schedules;