import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  MenuItem,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { getTrainees, createTrainee, updateTrainee, deleteTrainee } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const LEVELS = ['beginner', 'intermediate', 'advanced'];

const Trainees = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    emergencyContact: '',
    emergencyPhone: '',
    experienceLevel: 'beginner',
  });

  const { data, isLoading, error: queryError } = useQuery(
    'trainees',
    async () => {
      const response = await getTrainees();
      return response.data;
    },
    {
      staleTime: 5000,
    }
  );

  const createMutation = useMutation(createTrainee, {
    onSuccess: () => {
      queryClient.invalidateQueries('trainees');
      handleClose();
    },
    onError: (error) => {
      setError(error.response?.data?.message || t('trainee.error.failedToSave'));
    },
  });

  const updateMutation = useMutation(
    ({ id, data }) => updateTrainee(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trainees');
        handleClose();
      },
      onError: (error) => {
        setError(error.response?.data?.message || t('trainee.error.failedToUpdate'));
      },
    }
  );

  const deleteMutation = useMutation(deleteTrainee, {
    onSuccess: () => {
      queryClient.invalidateQueries('trainees');
    },
    onError: (error) => {
      setError(error.response?.data?.message || t('trainee.error.failedToDelete'));
    },
  });

  const handleOpen = (trainee = null) => {
    if (trainee) {
      setSelectedTrainee(trainee);
      setFormData({
        name: trainee.name,
        email: trainee.email,
        phone: trainee.phone,
        dateOfBirth: trainee.dateOfBirth?.split('T')[0] || '',
        emergencyContact: trainee.emergencyContact,
        emergencyPhone: trainee.emergencyPhone,
        experienceLevel: trainee.experienceLevel,
      });
    } else {
      setSelectedTrainee(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        emergencyContact: '',
        emergencyPhone: '',
        experienceLevel: 'beginner',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTrainee(null);
    setError(null);
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedTrainee) {
      updateMutation.mutate({
        id: selectedTrainee._id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(t('trainee.confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const trainees = data?.trainees || [];

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('trainee.title')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          {t('trainee.addTrainee')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {trainees.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                {t('trainee.noTraineesFound')}
              </Typography>
            </Paper>
          </Grid>
        ) : (
          trainees.map((trainee) => (
            <Grid item xs={12} sm={6} md={4} key={trainee._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {trainee.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {trainee.email}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>{t('common.phone')}:</strong> {trainee.phone}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>{t('common.level')}:</strong> {t(`trainee.levels.${trainee.experienceLevel}`)}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={trainee.active ? t('trainee.status.active') : t('trainee.status.inactive')}
                        color={trainee.active ? "success" : "default"}
                        size="small"
                      />
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Tooltip title={t('common.edit')}>
                    <IconButton
                      onClick={() => handleOpen(trainee)}
                      color="primary"
                      size="small"
                      aria-label={t('common.edit')}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('common.delete')}>
                    <IconButton
                      onClick={() => handleDelete(trainee._id)}
                      color="error"
                      size="small"
                      aria-label={t('common.delete')}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedTrainee ? t('trainee.editTrainee') : t('trainee.addTrainee')}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
              <TextField
                name="name"
                label={t('common.name')}
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="email"
                label={t('common.email')}
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="phone"
                label={t('common.phone')}
                value={formData.phone}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="dateOfBirth"
                label={t('trainee.dateOfBirth')}
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="emergencyContact"
                label={t('trainee.emergencyContactName')}
                value={formData.emergencyContact}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="emergencyPhone"
                label={t('trainee.emergencyContactPhone')}
                value={formData.emergencyPhone}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="experienceLevel"
                label={t('common.level')}
                select
                value={formData.experienceLevel}
                onChange={handleChange}
                required
                fullWidth
              >
                {LEVELS.map((level) => (
                  <MenuItem key={level} value={level}>
                    {t(`trainee.levels.${level}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {createMutation.isLoading || updateMutation.isLoading
                ? t('common.saving')
                : t('common.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Trainees;
