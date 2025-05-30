import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '../../components/layout/MainLayout.tsx';
import axiosInstance from '../../api/axios.ts';
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
  Box,
  Card,
  CardContent
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonIcon from '@mui/icons-material/Person';

interface Materia {
  ID_Materia: number;
  Nombre: string;
  Salon: {
    ID_Salon: number;
    Nombre: string;
  };
  Maestro: {
    ID_Maestro: number;
    Nombre: string;
  };
}

const MisMaterias: React.FC = () => {
  const data = localStorage.getItem('auth');
  const parsedData = data ? JSON.parse(data) : null;
  // Fetch teacher's subjects
  const { data: materias, isLoading, error } = useQuery({
    queryKey: ['maestro', 'materias'],
    queryFn: async () => {
      const response = await axiosInstance.post('/maestros/me/materias', parsedData);
      return response.data as Materia[];
    }
  });

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Mis Materias
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Error al cargar las materias</Alert>
      ) : (
        <>
          {/* Statistics */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2, 
            marginBottom: 4 
          }}>
            <Card sx={{ flex: '1 1 300px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">Total de Materias</Typography>
                </Box>
                <Typography variant="h4">{materias?.length || 0}</Typography>
              </CardContent>
            </Card>
          </Box>
          
          {/* Subjects Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre de la Materia</TableCell>
                  <TableCell>
                    <MeetingRoomIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Salón
                  </TableCell>
                  <TableCell>
                    <PersonIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Maestro
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materias && materias.length > 0 ? (
                  materias.map((materia) => (
                    <TableRow key={materia.ID_Materia}>
                      <TableCell>{materia.Nombre}</TableCell>
                      <TableCell>{materia.Salon.Nombre}</TableCell>
                      <TableCell>{materia.Maestro.Nombre}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No hay materias asignadas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </MainLayout>
  );
};

export default MisMaterias;