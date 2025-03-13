// pages/Attendance.js - Página de gestión de asistencia
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import API from '../services/api';

function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAttendance, setNewAttendance] = useState({
    scheduleId: '',
    attended: true
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceResponse, schedulesResponse] = await Promise.all([
        API.getAllAttendance(),
        API.getAllSchedules()
      ]);
      
      setAttendanceRecords(attendanceResponse.data);
      setSchedules(schedulesResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar datos');
      setLoading(false);
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setNewAttendance({ ...newAttendance, [name]: checked });
    } else {
      setNewAttendance({ ...newAttendance, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const attendanceToSave = {
        ...newAttendance,
        scheduleId: parseInt(newAttendance.scheduleId)
      };
      
      await API.markAttendance(attendanceToSave);
      setNewAttendance({
        scheduleId: '',
        attended: true
      });
      setMessage({ type: 'success', text: 'Asistencia registrada con éxito' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error al registrar asistencia' });
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Gestión de Asistencia</h1>
      
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      <Row className="mb-4">
        <Col lg={5}>
          <Card>
            <Card.Header>Registrar Asistencia</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Horario</Form.Label>
                  <Form.Select
                    name="scheduleId"
                    value={newAttendance.scheduleId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar horario</option>
                    {schedules.map(schedule => (
                      <option key={schedule.id} value={schedule.id}>
                        {`ID: ${schedule.id} - ${schedule.subject} (${schedule.day} ${schedule.startTime})`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="attended"
                    label="Asistió"
                    checked={newAttendance.attended}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Registrar</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7}>
          <Card>
            <Card.Header>Registro de Asistencias</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Cargando asistencias...</p>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>ID Horario</th>
                      <th>Asistencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.length > 0 ? (
                      attendanceRecords.map(record => (
                        <tr key={record.id}>
                          <td>{record.id}</td>
                          <td>{record.scheduleId}</td>
                          <td>
                            {record.attended ? 
                              <span className="text-success">Presente</span> : 
                              <span className="text-danger">Ausente</span>
                            }
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">No hay registros de asistencia</td>
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

export default Attendance;