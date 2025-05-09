// src/pages/admin/HorarioManagement.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from '../../components/layout/MainLayout.tsx';
import axiosInstance from '../../api/axios.ts';
import WeeklyScheduleSelector from '../../components/WeeklyScheduleSelector.tsx';
import {
  Typography,
  Paper,
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';

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

interface Horario {
  ID_Grupo: number;
  ID_Materia: number;
  ID_Salon: number;
  Dia: string;
  HoraInicio: string;
  HoraFin: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`horario-tabpanel-${index}`}
      aria-labelledby={`horario-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const HorarioManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState<number>(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Obtener datos necesarios del servidor
  const { data: grupos, isLoading: gruposLoading, error: gruposError } = useQuery({
    queryKey: ['grupos'],
    queryFn: async () => {
      const response = await axiosInstance.get('/grupos');
      return response.data as Grupo[];
    }
  });

  const { data: materias, isLoading: materiasLoading, error: materiasError } = useQuery({
    queryKey: ['materias'],
    queryFn: async () => {
      const response = await axiosInstance.get('/materias');
      return response.data as Materia[];
    }
  });

  const { data: salones, isLoading: salonesLoading, error: salonesError } = useQuery({
    queryKey: ['salones'],
    queryFn: async () => {
      const response = await axiosInstance.get('/salones');
      return response.data as Salon[];
    }
  });

  const { data: horarios, isLoading: horariosLoading, error: horariosError } = useQuery({
    queryKey: ['horarios'],
    queryFn: async () => {
      const response = await axiosInstance.get('/horarios');
      return response.data;
    }
  });

  // Mutación para crear horarios
  const createHorariosMutation = useMutation({
    mutationFn: async (horarios: Horario[]) => {
      // Para múltiples horarios, hacemos peticiones secuenciales
      const results: any[] = [];
      for (const horario of horarios) {
        const response = await axiosInstance.post('/horarios', horario);
        results.push(response.data);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horarios'] });
      setSnackbar({
        open: true,
        message: 'Horarios guardados exitosamente',
        severity: 'success'
      });
    },
    onError: (error: any) => {
      console.error('Error al guardar horarios:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al guardar los horarios',
        severity: 'error'
      });
    }
  });

  // Manejar cambio de pestaña
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Manejar guardado de horarios
  const handleSaveHorarios = (horarios: Horario[]) => {
    createHorariosMutation.mutate(horarios);
  };

  // Verificar si hay errores en la carga de datos
  const hasErrors = gruposError || materiasError || salonesError || horariosError;
  const isLoading = gruposLoading || materiasLoading || salonesLoading || horariosLoading;

  return (
    <MainLayout>
      <div style={{ padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Administración de Horarios
        </Typography>

        {hasErrors ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Error al cargar los datos necesarios. Por favor, intente de nuevo.
          </Alert>
        ) : isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <div>
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                aria-label="pestañas de horarios"
              >
                <Tab label="Registrar Nuevos Horarios" />
                <Tab label="Ver Horarios Existentes" />
              </Tabs>

              {/* Pestaña para registrar nuevos horarios */}
              <TabPanel value={tabValue} index={0}>
                {grupos && materias && salones ? (
                  <WeeklyScheduleSelector
                    grupos={grupos}
                    materias={materias}
                    salones={salones}
                    onSave={handleSaveHorarios}
                  />
                ) : (
                  <Alert severity="warning">
                    Faltan datos necesarios para crear horarios. Asegúrese de que hay grupos, materias y salones registrados.
                  </Alert>
                )}
              </TabPanel>

              {/* Pestaña para ver horarios existentes */}
              <TabPanel value={tabValue} index={1}>
                {horarios && horarios.length > 0 ? (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Horarios Registrados
                    </Typography>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {horarios.map((horario: any, index: number) => {
                        const grupo = grupos?.find(g => g.ID_Grupo === horario.ID_Grupo);
                        const materia = materias?.find(m => m.ID_Materia === horario.ID_Materia);
                        const salon = salones?.find(s => s.ID_Salon === horario.ID_Salon);
                        
                        return (
                          <Paper 
                            key={index} 
                            sx={{ 
                              p: 2, 
                              mb: 1, 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              bgcolor: '#f5f5f5' 
                            }}
                          >
                            <div>
                              <Typography variant="subtitle1">
                                {materia?.Nombre} - {grupo?.Nombre}
                              </Typography>
                              <Typography variant="body2">
                                {horario.Dia} de {horario.HoraInicio} a {horario.HoraFin} - Salón: {salon?.Nombre}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Profesor: {materia?.Maestro.Nombre}
                              </Typography>
                            </div>
                          </Paper>
                        );
                      })}
                    </div>
                  </Box>
                ) : (
                  <Alert severity="info">
                    No hay horarios registrados aún. Utilice la pestaña "Registrar Nuevos Horarios" para crear horarios.
                  </Alert>
                )}
              </TabPanel>
            </Paper>

            {/* Snackbar para notificaciones */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              message={snackbar.message}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HorarioManagement;