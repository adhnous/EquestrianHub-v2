import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
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
  Divider,
  CircularProgress
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
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    },
    status: 'active'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: trainers = [], isLoading, error: queryError } = useQuery(
    'trainers',
    async () => {
      const response = await getTrainers();
      console.log('Raw trainer response:', response); // Debug full response
      if (response?.data?.success && Array.isArray(response.data.trainers)) {
        return response.data.trainers;
      }
      console.log('Fallback to empty array, response was:', response?.data);
      return [];
    },
    {
      onError: (error) => {
        console.error('Error fetching trainers:', error);
        setError(error.response?.data?.message || 'Failed to fetch trainers');
      },
      staleTime: 0, // Consider data stale immediately
      cacheTime: 0, // Don't cache at all
      refetchOnMount: true, // Always refetch on mount
      refetchOnWindowFocus: true // Refetch when window regains focus
    }
  );

  // Debug log for trainers data
  useEffect(() => {
    console.log('Current trainers:', trainers);
  }, [trainers]);

  const createTrainerMutation = useMutation(
    (newTrainer) => createTrainer(newTrainer),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trainers');
      },
    }
  );

  const updateTrainerMutation = useMutation(
    (updatedTrainer) => updateTrainer(updatedTrainer.id, updatedTrainer),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trainers');
      },
    }
  );

  const deleteMutation = useMutation(
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
        password: trainer.password,
        specialization: trainer.specialization,
        certifications: trainer.certifications,
        availability: trainer.availability,
        status: trainer.status
      });
    } else {
      setSelectedTrainer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',  
        specialization: 'general',
        certifications: [],
        availability: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        },
        status: 'active'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTrainer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedTrainer) {
        await updateTrainerMutation.mutateAsync({
          id: selectedTrainer._id,
          data: formData
        });
      } else {
        await createTrainerMutation.mutateAsync(formData);
      }
      setOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',  
        specialization: 'general',
        certifications: [],
        availability: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        },
        status: 'active'
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('common.confirmDelete'))) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting trainer:', error);
      }
    }
  };

  const handleEdit = (trainer) => {
    handleOpen(trainer);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (queryError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {queryError.response?.data?.message || 'Error loading trainers. Please try again later.'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('common.trainers')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedTrainer(null);
            setOpen(true);
          }}
        >
          {t('trainer.addTrainer')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(trainers) && trainers.length > 0 ? (
          trainers.map((trainer) => (
            <Grid item xs={12} sm={6} md={4} key={trainer._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {trainer.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {trainer.email}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {t('common.phone')}: {trainer.phone}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {t('trainer.specialization')}: {t(`trainer.specializations.${trainer.specialization}`)}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label={t(`common.${trainer.status}`)} 
                      color={trainer.status === 'active' ? 'success' : 'default'}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {trainer.certifications?.length > 0 && (
                      <Chip 
                        label={`${trainer.certifications.length} ${t('common.certifications')}`}
                        color="info"
                        size="small"
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(trainer)}
                  >
                    {t('common.edit')}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(trainer._id)}
                  >
                    {t('common.delete')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ 
              p: 3, 
              textAlign: 'center',
              bgcolor: 'background.paper',
              borderRadius: 1
            }}>
              <Typography color="textSecondary">
                {t('common.noTrainersFound')}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedTrainer ? t('trainer.editTrainer') : t('trainer.addTrainer')}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>{t('common.basicInformation')}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('common.name')}
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('common.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('common.phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('common.password')}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>{t('trainer.professionalDetails')}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('trainer.specialization')}</InputLabel>
                  <Select
                    value={formData.specialization}
                    label={t('trainer.specialization')}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  >
                    <MenuItem value="dressage">{t('trainer.specializations.dressage')}</MenuItem>
                    <MenuItem value="jumping">{t('trainer.specializations.jumping')}</MenuItem>
                    <MenuItem value="eventing">{t('trainer.specializations.eventing')}</MenuItem>
                    <MenuItem value="western">{t('trainer.specializations.western')}</MenuItem>
                    <MenuItem value="general">{t('trainer.specializations.general')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('common.certifications')}
                  name="certifications"
                  value={formData.certifications.join(', ')}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value.split(', ') })}
                  helperText={t('common.certificationsHelperText')}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>{t('common.availability')}</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {t('common.availabilityHelperText')}
                </Typography>
              </Grid>
              {Object.keys(formData.availability).map((day) => (
                <Grid item xs={12} md={6} key={day}>
                  <TextField
                    fullWidth
                    label={t(`common.${day}`)}
                    name={`availability.${day}`}
                    value={formData.availability[day].join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: {
                        ...formData.availability,
                        [day]: e.target.value.split(', ')
                      }
                    })}
                    helperText={t(`common.${day}HelperText`)}
                  />
                </Grid>
              ))}
            </Grid>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {loading ? t('common.saving') : selectedTrainer ? t('common.update') : t('common.add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TrainerList;
