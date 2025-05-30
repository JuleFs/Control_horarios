import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainLayout from "../../components/layout/MainLayout.tsx";
import axiosInstance from "../../api/axios.ts";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
} from "@mui/material";
import { format, parse } from "date-fns";

interface Horario {
  ID: number;
  HoraInicio: string;
  HoraFin: string;
  Dias: string;
  Materia: {
    ID_Materia: number;
    Nombre: string;
    Maestro: {
      ID_Maestro: number;
      Nombre: string;
    };
  };
  Salon: {
    ID_Salon: number;
    Nombre: string;
  };
  Grupo: {
    ID_Grupo: number;
    Nombre: string;
  };
}

interface CreateAsistenciaDto {
  Horario_ID: number;
  Asistio: boolean;
  Fecha: string;
}

interface Asistencia {
  user: any;
  asistencia: CreateAsistenciaDto;
}

const AlumnoHorarios: React.FC = () => {
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();
  const data = localStorage.getItem("auth");
  const user = data ? JSON.parse(data) : null;

  // Fetch student schedules
  const {
    data: horarios,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["horarios"],
    queryFn: async () => {
      const response = await axiosInstance.post("/alumnos/me/horarios", user);
      return response.data as Horario[];
    },
  });

  // Register attendance mutation
  const registerAttendanceMutation = useMutation({
    mutationFn: async (data: Asistencia) => {
      const response = await axiosInstance.post("/alumnos/me/asistencia", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asistencias"] });
      setOpenDialog(false);
    },
  });

  const handleRegisterAttendance = (horario: Horario) => {
    setSelectedHorario(horario);
    setOpenDialog(true);
  };

  const confirmAttendance = () => {
    if (!selectedHorario) return;

    const today = new Date().toISOString().split("T")[0];

    registerAttendanceMutation.mutate({
      user: user,
      asistencia: {
        Horario_ID: selectedHorario.ID,
        Asistio: true,
        Fecha: today,
      },
    });
  };

  // Group schedules by day of week and sort by time
  const groupByDay = () => {
    if (!horarios) return {};

    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    
    const grouped = horarios.reduce((acc, horario) => {
      const dayOfWeek = new Date(horario.Dias).getDay();
      const day = days[dayOfWeek];

      if (!acc[day]) {
        acc[day] = [];
      }

      acc[day].push(horario);
      return acc;
    }, {} as Record<string, Horario[]>);

    // Sort classes within each day by start time
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => {
        const timeA = a.HoraInicio;
        const timeB = b.HoraInicio;
        return timeA.localeCompare(timeB);
      });
    });

    return grouped;
  };

  const scheduleByDay = groupByDay();

  // Get today's day name and reorder days to show today first
  const getTodayFirst = () => {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    
    const today = new Date().getDay();
    const todayName = days[today];
    
    // Create ordered array starting with today
    const orderedDays: [string, Horario[]][] = [];
    
    // First add today if it has classes
    if (scheduleByDay[todayName]) {
      orderedDays.push([todayName, scheduleByDay[todayName]]);
    }
    
    // Then add other days that have classes (excluding today)
    Object.entries(scheduleByDay).forEach(([day, dayHorarios]) => {
      if (day !== todayName) {
        orderedDays.push([day, dayHorarios]);
      }
    });
    
    return orderedDays;
  };

  const orderedSchedule = getTodayFirst();

  // Format time for display (19:30:00 -> 7:30 PM)
  const formatTime = (timeStr: string) => {
    try {
      const date = parse(timeStr, "HH:mm:ss", new Date());
      return format(date, "h:mm a");
    } catch {
      return timeStr;
    }
  };

  // Check if a day is today
  const isToday = (dayName: string) => {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const today = new Date().getDay();
    return days[today] === dayName;
  };

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Horario
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Error al Intentar Cargar los Horarios</Alert>
      ) : (
        <>
          {orderedSchedule.map(([day, dayHorarios]) => (
            <Box key={day} sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mt: 3,
                  color: isToday(day) ? 'primary.main' : 'inherit',
                  fontWeight: isToday(day) ? 'bold' : 'normal'
                }}
              >
                {day} {isToday(day) && '(Hoy)'}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Materia</TableCell>
                      <TableCell>Hora</TableCell>
                      <TableCell>Maestro</TableCell>
                      <TableCell>Salón</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dayHorarios.map((horario) => (
                      <TableRow key={horario.ID}>
                        <TableCell>{horario.Materia.Nombre}</TableCell>
                        <TableCell>
                          {formatTime(horario.HoraInicio)} -{" "}
                          {formatTime(horario.HoraFin)}
                        </TableCell>
                        <TableCell>{horario.Materia.Maestro.Nombre}</TableCell>
                        <TableCell>{horario.Salon.Nombre}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleRegisterAttendance(horario)}
                            // Only enable for today's classes
                            disabled={!isToday(day)}
                          >
                            Registrar Asistencia
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}

          {/* Check if there are no classes scheduled */}
          {orderedSchedule.length === 0 && (
            <Alert severity="info">Aún no tienes clases programadas.</Alert>
          )}

          {/* Attendance Confirmation Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Confirmar Asistencia</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Quieres registrar la asistencia para{" "}
                {selectedHorario?.Materia.Nombre}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button
                onClick={confirmAttendance}
                variant="contained"
                disabled={registerAttendanceMutation.isPending}
              >
                {registerAttendanceMutation.isPending
                  ? "Registrando..."
                  : "Confirmar"}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </MainLayout>
  );
};

export default AlumnoHorarios;
