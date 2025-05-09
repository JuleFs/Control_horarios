// src/pages/admin/SalonManagement.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

interface Salon {
  ID_Salon: number;
  Nombre: string;
}

interface CreateSalonDto {
  Nombre: string;
}

const AulaManagement: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'delete'>('add');
  const [currentSalon, setCurrentSalon] = useState<Salon | null>(null);
  const [formData, setFormData] = useState<{
    Nombre: string;
  }>({
    Nombre: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  const queryClient = useQueryClient();
  
  // Obtener todos los salones
  const { data: salones, isLoading } = useQuery({
    queryKey: ['salones'],
    queryFn: async () => {
      const response = await axiosInstance.get('/salones');
      return response.data as Salon[];
    }
  });
  
  // Crear nuevo salón
  const createMutation = useMutation({
    mutationFn: async (data: CreateSalonDto) => {
      const response = await axiosInstance.post('/salones', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salones'] });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: 'Salón creado exitosamente',
        severity: 'success'
      });
    },
    onError: (error: any) => {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al crear el salón',
        severity: 'error'
      });
    }
  });
  
  // Actualizar salón existente
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CreateSalonDto }) => {
      const response = await axiosInstance.put(`/salones/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salones'] });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: 'Salón actualizado exitosamente',
        severity: 'success'
      });
    },
    onError: (error: any) => {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al actualizar el salón',
        severity: 'error'
      });
    }
  });
  
  // Eliminar salón
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/salones/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salones'] });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: 'Salón eliminado exitosamente',
        severity: 'success'
      });
    },
    onError: (error: any) => {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al eliminar el salón',
        severity: 'error'
      });
    }
  });
  
  // Manejar clic en el botón de agregar
  const handleAddClick = () => {
    setDialogType('add');
    setCurrentSalon(null);
    setFormData({
      Nombre: '',
    });
    setOpenDialog(true);
  };
  
  // Manejar clic en el botón de editar
  const handleEditClick = (salon: Salon) => {
    setDialogType('edit');
    setCurrentSalon(salon);
    setFormData({
      Nombre: salon.Nombre,
    });
    setOpenDialog(true);
  };
  
  // Manejar clic en el botón de eliminar
  const handleDeleteClick = (salon: Salon) => {
    setDialogType('delete');
    setCurrentSalon(salon);
    setOpenDialog(true);
  };
  
  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Manejar envío del formulario
  const handleSubmit = () => {
    if (!isFormValid()) return;
    
    const submissionData: CreateSalonDto = {
      Nombre: formData.Nombre,
    };
    
    if (dialogType === 'add') {
      createMutation.mutate(submissionData);
    } else if (dialogType === 'edit' && currentSalon) {
      updateMutation.mutate({ id: currentSalon.ID_Salon, data: submissionData });
    } else if (dialogType === 'delete' && currentSalon) {
      deleteMutation.mutate(currentSalon.ID_Salon);
    }
  };
  
  // Validar formulario
  const isFormValid = (): boolean => {
    if (dialogType === 'delete') return true;
    return formData.Nombre.trim() !== '';
  };
  
  // Cerrar snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  return (
    <MainLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Gestión de Salones
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Nuevo Salón
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : salones && salones.length > 0 ? (
                salones.map((salon) => (
                  <TableRow key={salon.ID_Salon}>
                    <TableCell>{salon.ID_Salon}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MeetingRoomIcon color="primary" />
                        {salon.Nombre}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEditClick(salon)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton onClick={() => handleDeleteClick(salon)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No se encontraron salones
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Diálogo para Agregar/Editar/Eliminar */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'add' && 'Agregar Nuevo Salón'}
          {dialogType === 'edit' && 'Editar Salón'}
          {dialogType === 'delete' && 'Eliminar Salón'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'delete' ? (
            <Typography>
              ¿Está seguro de que desea eliminar este salón?
              <Box sx={{ mt: 2 }}>
                <strong>ID:</strong> {currentSalon?.ID_Salon}<br />
                <strong>Nombre:</strong> {currentSalon?.Nombre}
              </Box>
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                autoFocus
                margin="dense"
                name="Nombre"
                label="Nombre del Salón"
                type="text"
                fullWidth
                value={formData.Nombre}
                onChange={handleInputChange}
                required
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color={dialogType === 'delete' ? 'error' : 'primary'}
            disabled={
              createMutation.isPending || 
              updateMutation.isPending || 
              deleteMutation.isPending ||
              (dialogType !== 'delete' && !isFormValid())
            }
          >
            {dialogType === 'add' && (createMutation.isPending ? 'Creando...' : 'Crear')}
            {dialogType === 'edit' && (updateMutation.isPending ? 'Guardando...' : 'Guardar')}
            {dialogType === 'delete' && (deleteMutation.isPending ? 'Eliminando...' : 'Eliminar')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para retroalimentación */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default AulaManagement;