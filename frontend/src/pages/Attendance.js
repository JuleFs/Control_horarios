// pages/Attendance.js - Página de gestión de asistencia
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card, Alert, Modal } from 'react-bootstrap';
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
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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
    const updateData = type === 'checkbox' ? checked : value;
    
    if (editingAttendance) {
      setEditingAttendance({ ...editingAttendance, [name]: updateData });
    } else {
      setNewAttendance({ ...newAttendance, [name]: updateData });
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

  const handleEdit = (attendance) => {
    setEditingAttendance({
      ...attendance,
      scheduleId: attendance.scheduleId.toString()
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const attendanceToUpdate = {
        ...editingAttendance,
        scheduleId: parseInt(editingAttendance.scheduleId)
      };
      await API.updateAttendance(editingAttendance.id, attendanceToUpdate);
      setMessage({ type: 'success', text: 'Asistencia actualizada con éxito' });
      setShowEditModal(false);
      setEditingAttendance(null);
      fetchData();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error al actualizar asistencia' });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de asistencia?')) {
      try {
        await API.deleteAttendance(id);
        setMessage({ type: 'success', text: 'Registro de asistencia eliminado con éxito' });
        fetchData();
      } catch (err) {
        setMessage({ type: 'danger', text: 'Error al eliminar registro de asistencia' });
        console.error(err);
      }
    }
  };

  const getScheduleDetails = (scheduleId) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    return schedule ? `${schedule.subject} (${schedule.day} ${schedule.startTime})` : `ID: ${scheduleId}`;
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
                        {getScheduleDetails(schedule.id)}
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
                      <th>Horario</th>
                      <th>Asistencia</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.length > 0 ? (
                      attendanceRecords.map(record => (
                        <tr key={record.id}>
                          <td>{record.id}</td>
                          <td>{getScheduleDetails(record.scheduleId)}</td>
                          <td>
                            {record.attended ? 
                              <span className="text-success">Presente</span> : 
                              <span className="text-danger">Ausente</span>
                            }
                          </td>
                          <td>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(record)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No hay registros de asistencia</td>
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
          <Modal.Title>Editar Registro de Asistencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Horario</Form.Label>
              <Form.Select
                name="scheduleId"
                value={editingAttendance?.scheduleId || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar horario</option>
                {schedules.map(schedule => (
                  <option key={schedule.id} value={schedule.id}>
                    {getScheduleDetails(schedule.id)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="attended"
                label="Asistió"
                checked={editingAttendance?.attended || false}
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

export default Attendance;