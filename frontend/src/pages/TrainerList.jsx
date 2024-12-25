import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '../services/api';

const TrainerList = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specialization: 'general',
    certifications: [],
    status: 'active'
  });

  const queryClient = useQueryClient();

  const { data: trainersResponse, isLoading } = useQuery('trainers', async () => {
    const response = await getTrainers();
    return response.data;
  });

  const trainers = trainersResponse?.trainers || [];

  const createTrainerMutation = useMutation(
    (newTrainer) => createTrainer(newTrainer),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trainers');
        handleClose();
      },
    }
  );

  const updateTrainerMutation = useMutation(
    (updatedTrainer) => updateTrainer(updatedTrainer._id, updatedTrainer),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trainers');
        handleClose();
      },
    }
  );

  const deleteTrainerMutation = useMutation(
    (trainerId) => deleteTrainer(trainerId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trainers');
      },
    }
  );

  const handleOpen = (trainer = null) => {
    if (trainer) {
      setSelectedTrainer(trainer);
      setFormData({
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
        specialization: trainer.specialization,
        certifications: trainer.certifications || [],
        status: trainer.status
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTrainer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      specialization: 'general',
      certifications: [],
      status: 'active'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTrainer) {
      updateTrainerMutation.mutate({ ...formData, _id: selectedTrainer._id });
    } else {
      createTrainerMutation.mutate(formData);
    }
  };

  const handleDelete = (trainerId) => {
    if (window.confirm(t('common.confirmDelete'))) {
      deleteTrainerMutation.mutate(trainerId);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 4,
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          {t('common.trainers')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          {t('trainer.addTrainer')}
        </Button>
      </Box>

      {/* Trainer Grid */}
      <Grid container spacing={3}>
        {trainers && trainers.length > 0 ? (
          trainers.map((trainer) => (
            <Grid item xs={12} sm={12} md={6} key={trainer._id}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
                }
              }}>
                <CardContent sx={{ 
                  p: 3,
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Name and Status */}
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 3
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                        fontSize: '1.25rem'
                      }}
                    >
                      {trainer.name}
                    </Typography>
                    <Chip
                      label={trainer.status === 'active' ? t('common.active') : t('common.inactive')}
                      color={trainer.status === 'active' ? 'success' : 'default'}
                      size="small"
                      sx={{ 
                        borderRadius: '6px',
                        height: '24px',
                        minWidth: '80px',
                        '& .MuiChip-label': {
                          px: 1,
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>

                  {/* Contact Info */}
                  <Box sx={{ 
                    mb: 'auto',
                    display: 'grid',
                    gap: 2
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'text.secondary'
                      }}
                    >
                      {trainer.email}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Typography component="span" color="text.secondary">
                        {t('trainer.phone')}:
                      </Typography>
                      {trainer.phone}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Typography component="span" color="text.secondary">
                        {t('trainer.specialization')}:
                      </Typography>
                      {t(`trainer.specializations.${trainer.specialization}`)}
                    </Typography>
                  </Box>

                  {/* Certifications */}
                  {trainer.certifications?.length > 0 && (
                    <Box sx={{ 
                      mt: 3,
                      mb: 2
                    }}>
                      <Chip
                        label={`${trainer.certifications.length} ${t('common.certifications')}`}
                        color="info"
                        size="small"
                        sx={{ 
                          borderRadius: '6px',
                          height: '24px',
                          minWidth: '120px',
                          '& .MuiChip-label': {
                            px: 1,
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </Box>
                  )}

                  {/* Actions */}
                  <Box sx={{ 
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Button
                      startIcon={<EditIcon />}
                      size="small"
                      onClick={() => handleOpen(trainer)}
                      sx={{
                        borderRadius: '6px',
                        textTransform: 'none',
                        minWidth: '100px'
                      }}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      size="small"
                      color="error"
                      onClick={() => handleDelete(trainer._id)}
                      sx={{
                        borderRadius: '6px',
                        textTransform: 'none',
                        minWidth: '100px'
                      }}
                    >
                      {t('common.delete')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ 
              textAlign: 'center',
              py: 4,
              bgcolor: 'background.paper',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <Typography variant="h6" color="text.secondary">
                {t('common.noTrainers')}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTrainer ? t('trainer.editTrainer') : t('trainer.addTrainer')}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t('trainer.name')}
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label={t('trainer.email')}
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label={t('trainer.phone')}
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            {!selectedTrainer && (
              <TextField
                margin="dense"
                label={t('trainer.password')}
                type="password"
                fullWidth
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            )}
            <FormControl fullWidth margin="dense">
              <InputLabel>{t('trainer.specialization')}</InputLabel>
              <Select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                label={t('trainer.specialization')}
                required
              >
                <MenuItem value="general">{t('trainer.specializations.general')}</MenuItem>
                <MenuItem value="dressage">{t('trainer.specializations.dressage')}</MenuItem>
                <MenuItem value="jumping">{t('trainer.specializations.jumping')}</MenuItem>
                <MenuItem value="eventing">{t('trainer.specializations.eventing')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>{t('common.status')}</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label={t('common.status')}
                required
              >
                <MenuItem value="active">{t('common.active')}</MenuItem>
                <MenuItem value="inactive">{t('common.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            <Button type="submit" variant="contained">
              {selectedTrainer ? t('common.save') : t('common.submit')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TrainerList;
