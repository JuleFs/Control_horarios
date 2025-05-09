// src/components/WeeklyScheduleSelector.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Checkbox, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Alert,
  Chip,
  SelectChangeEvent
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

// Interfaces
interface Grupo {
  ID_Grupo: number;
  Nombre: string;
}

interface Materia {
  ID_Materia: number;
  Nombre: string;
  Maestro: {
    ID_Maestro: number;
    Nombre: string;
  };
}

interface Salon {
  ID_Salon: number;
  Nombre: string;
}

interface HorarioFormData {
  Grupo_ID: string;
  Materia_ID: string;
  Salon_ID: string;
  HoraInicio: Date | null;
  HoraFin: Date | null;
  diasSeleccionados: boolean[];
}

interface HorarioAgregado {
  id: number;
  Grupo_ID: number;
  grupoNombre: string;
  Materia_ID: number;
  materiaNombre: string;
  maestroNombre: string;
  Salon_ID: number;
  salonNombre: string;
  HoraInicio: string;
  HoraFin: string;
  diaIndex: number;
  diaNombre: string;
}

interface WeeklyScheduleSelectorProps {
  grupos: Grupo[];
  materias: Materia[];
  salones: Salon[];
  onSave: (horarios: any[]) => void;
}

const WeeklyScheduleSelector: React.FC<WeeklyScheduleSelectorProps> = ({ 
  grupos, 
  materias, 
  salones, 
  onSave 
}) => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState<HorarioFormData>({
    Grupo_ID: '',
    Materia_ID: '',
    Salon_ID: '',
    HoraInicio: null,
    HoraFin: null,
    // Días de la semana: 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    diasSeleccionados: Array(7).fill(false)
  });
  
  // Estado para la lista de horarios añadidos
  const [horariosAgregados, setHorariosAgregados] = useState<HorarioAgregado[]>([]);
  
  // Manejar cambios en los campos de selección
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Manejar cambios en los selectores de hora
  const handleTimeChange = (name: string, newValue: Date | null) => {
    setFormData({
      ...formData,
      [name]: newValue
    });
  };
  
  // Manejar la selección de días
  const handleDayToggle = (dayIndex: number) => {
    const newDiasSeleccionados = [...formData.diasSeleccionados];
    newDiasSeleccionados[dayIndex] = !newDiasSeleccionados[dayIndex];
    setFormData({
      ...formData,
      diasSeleccionados: newDiasSeleccionados
    });
  };
  
  // Validar y agregar un horario a la lista
  const handleAgregarHorario = () => {
    // Verificar que todos los campos estén llenos
    if (!formData.Grupo_ID || !formData.Materia_ID || !formData.Salon_ID ||
        !formData.HoraInicio || !formData.HoraFin ||
        !formData.diasSeleccionados.some(day => day)) {
      alert('Por favor complete todos los campos y seleccione al menos un día');
      return;
    }
    
    // Obtener nombres basados en IDs
    const grupo = grupos.find(g => g.ID_Grupo.toString() === formData.Grupo_ID);
    const materia = materias.find(m => m.ID_Materia.toString() === formData.Materia_ID);
    const salon = salones.find(s => s.ID_Salon.toString() === formData.Salon_ID);
    
    if (!grupo || !materia || !salon) {
      alert('Error al obtener detalles del horario');
      return;
    }
    
    // Formatear horarios para visualización
    const horaInicio = formData.HoraInicio 
      ? format(formData.HoraInicio, 'HH:mm:00')
      : '';
    const horaFin = formData.HoraFin 
      ? format(formData.HoraFin, 'HH:mm:00')
      : '';
    
    // Crear horarios para cada día seleccionado
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    const nuevosHorarios = formData.diasSeleccionados
      .map((seleccionado, index) => {
        if (!seleccionado) return null;
        
        return {
          id: Date.now() + index, // ID temporal
          Grupo_ID: parseInt(formData.Grupo_ID),
          grupoNombre: grupo.Nombre,
          Materia_ID: parseInt(formData.Materia_ID),
          materiaNombre: materia.Nombre,
          maestroNombre: materia.Maestro.Nombre,
          Salon_ID: parseInt(formData.Salon_ID),
          salonNombre: salon.Nombre,
          HoraInicio: horaInicio,
          HoraFin: horaFin,
          diaIndex: index,
          diaNombre: diasSemana[index]
        };
      })
      .filter(Boolean) as HorarioAgregado[]; // Elimina los nulos (días no seleccionados)
    
    setHorariosAgregados([...horariosAgregados, ...nuevosHorarios]);
    
    // Limpiar el formulario
    setFormData({
      Grupo_ID: '',
      Materia_ID: '',
      Salon_ID: '',
      HoraInicio: null,
      HoraFin: null,
      diasSeleccionados: Array(7).fill(false)
    });
  };
  
  // Eliminar un horario de la lista
  const handleRemoveHorario = (id: number) => {
    setHorariosAgregados(horariosAgregados.filter(horario => horario.id !== id));
  };
  
  // Guardar todos los horarios
  const handleGuardarHorarios = () => {
    if (horariosAgregados.length === 0) {
      alert('No hay horarios para guardar');
      return;
    }
    
    // Formatear los horarios para la API
    const horariosParaAPI = horariosAgregados.map(horario => {
      // Crear una fecha para el día de la semana (usando la fecha actual como base)
      const today = new Date();
      const dayOfWeek = today.getDay();
      const diffDays = horario.diaIndex - dayOfWeek;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + diffDays);
      
      return {
        Grupo_ID: horario.Grupo_ID,
        Materia_ID: horario.Materia_ID,
        Salon_ID: horario.Salon_ID,
        HoraInicio: horario.HoraInicio,
        HoraFin: horario.HoraFin,
        Dias: format(targetDate, 'yyyy-MM-dd')
      };
    });
    
    onSave(horariosParaAPI);
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Registro de Horarios
        </Typography>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            1. Seleccione los detalles del horario
          </Typography>
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="grupo-label">Grupo</InputLabel>
              <Select
                labelId="grupo-label"
                name="Grupo_ID"
                value={formData.Grupo_ID}
                label="Grupo"
                onChange={handleSelectChange}
              >
                <MenuItem value="" disabled>Seleccione un grupo</MenuItem>
                {grupos.map(grupo => (
                  <MenuItem key={grupo.ID_Grupo} value={grupo.ID_Grupo.toString()}>
                    {grupo.Nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="materia-label">Materia</InputLabel>
              <Select
                labelId="materia-label"
                name="Materia_ID"
                value={formData.Materia_ID}
                label="Materia"
                onChange={handleSelectChange}
              >
                <MenuItem value="" disabled>Seleccione una materia</MenuItem>
                {materias.map(materia => (
                  <MenuItem key={materia.ID_Materia} value={materia.ID_Materia.toString()}>
                    {materia.Nombre} - {materia.Maestro.Nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="salon-label">Salón</InputLabel>
              <Select
                labelId="salon-label"
                name="Salon_ID"
                value={formData.Salon_ID}
                label="Salón"
                onChange={handleSelectChange}
              >
                <MenuItem value="" disabled>Seleccione un salón</MenuItem>
                {salones.map(salon => (
                  <MenuItem key={salon.ID_Salon} value={salon.ID_Salon.toString()}>
                    {salon.Nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          
          <Typography variant="h6" gutterBottom>
            2. Seleccione el horario
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: {xs: 'wrap', md: 'nowrap'} }}>
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <TimePicker 
                label="Hora de inicio"
                value={formData.HoraInicio}
                onChange={(newValue) => handleTimeChange('HoraInicio', newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <TimePicker 
                label="Hora de fin"
                value={formData.HoraFin}
                onChange={(newValue) => handleTimeChange('HoraFin', newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            3. Seleccione los días de la semana
          </Typography>
          
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Domingo</TableCell>
                  <TableCell>Lunes</TableCell>
                  <TableCell>Martes</TableCell>
                  <TableCell>Miércoles</TableCell>
                  <TableCell>Jueves</TableCell>
                  <TableCell>Viernes</TableCell>
                  <TableCell>Sábado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                    <TableCell key={day} align="center">
                      <Checkbox
                        checked={formData.diasSeleccionados[day]}
                        onChange={() => handleDayToggle(day)}
                        color="primary"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAgregarHorario}
            >
              Agregar Horario
            </Button>
          </Box>
        </Paper>
        
        {horariosAgregados.length > 0 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Horarios Agregados
            </Typography>
            
            <TableContainer sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Día</TableCell>
                    <TableCell>Horario</TableCell>
                    <TableCell>Grupo</TableCell>
                    <TableCell>Materia</TableCell>
                    <TableCell>Profesor</TableCell>
                    <TableCell>Salón</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {horariosAgregados
                    .sort((a, b) => a.diaIndex - b.diaIndex || a.HoraInicio.localeCompare(b.HoraInicio))
                    .map((horario) => (
                    <TableRow key={horario.id}>
                      <TableCell>
                        <Chip 
                          icon={<EventIcon />} 
                          label={horario.diaNombre} 
                          color="primary" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>{horario.HoraInicio.substr(0, 5)} - {horario.HoraFin.substr(0, 5)}</TableCell>
                      <TableCell>{horario.grupoNombre}</TableCell>
                      <TableCell>{horario.materiaNombre}</TableCell>
                      <TableCell>{horario.maestroNombre}</TableCell>
                      <TableCell>{horario.salonNombre}</TableCell>
                      <TableCell align="center">
                        <Button 
                          color="error" 
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemoveHorario(horario.id)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleGuardarHorarios}
              >
                Guardar Todos los Horarios
              </Button>
            </Box>
          </Paper>
        )}
        
        {horariosAgregados.length === 0 && (
          <Alert severity="info" sx={{ mb: 4 }}>
            No hay horarios agregados. Complete el formulario y presione "Agregar Horario" para comenzar.
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default WeeklyScheduleSelector;