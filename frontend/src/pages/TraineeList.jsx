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
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  getTrainees, 
  getTrainee, 
  createTrainee, 
  updateTrainee, 
  deleteTrainee 
} from '../services/api';

const TraineeList = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    level: 'beginner',
    preferredDiscipline: '',
    emergencyContact: '',
  });
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  const { data: trainees = [], isLoading, error: queryError } = useQuery(
    'trainees',
    async () => {
      const response = await getTrainees();
      console.log('Raw trainee response:', response);
      if (response?.data?.success && Array.isArray(response.data.trainees)) {
        return response.data.trainees;
      }
      return [];
    },
    {
      onError: (error) => {
        console.error('Error fetching trainees:', error);
        setError(error.response?.data?.message || 'Failed to fetch trainees');
      }
    }
  );

  // Debug log for trainees data
  useEffect(() => {
    console.log('Current trainees:', trainees);
  }, [trainees]);

  const createMutation = useMutation(
    async (newTrainee) => {
      const response = await createTrainee(newTrainee);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create trainee');
      }
      return response.data.trainee;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trainees');
        handleClose();
      }
    }
  );

  const updateMutation = useMutation(
    async ({ id, data }) => {
      const response = await updateTrainee(id, data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update trainee');
      }
      return response.data.trainee;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trainees');
        handleClose();
      }
    }
  );

  const deleteMutation = useMutation(
    async (id) => {
      const response = await deleteTrainee(id);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete trainee');
      }
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trainees');
      }
    }
  );

  const handleOpen = (trainee = null) => {
    if (trainee) {
      setSelectedTrainee(trainee);
      setFormData({
        name: trainee.name,
        email: trainee.email,
        phone: trainee.phone,
        level: trainee.level,
        preferredDiscipline: trainee.preferredDiscipline,
        emergencyContact: trainee.emergencyContact,
      });
    } else {
      setSelectedTrainee(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        level: 'beginner',
        preferredDiscipline: '',
        emergencyContact: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTrainee(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTrainee) {
      updateMutation.mutate({ id: selectedTrainee._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('trainee.actions.confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (trainee) => {
    handleOpen(trainee);
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
          {queryError.response?.data?.message || 'Error loading trainees. Please try again later.'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('trainee.title')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedTrainee(null);
            setOpen(true);
          }}
        >
          {t('trainee.addTrainee')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(trainees) && trainees.length > 0 ? (
          trainees.map((trainee) => (
            <Grid item xs={12} sm={6} md={4} key={trainee._id}>
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
                    {trainee.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {trainee.email}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {t('trainee.phone')}: {trainee.phone}
                  </Typography>
                  {trainee.trainer && (
                    <Typography variant="body2" gutterBottom>
                      {t('trainee.trainer')}: {trainee.trainer.name}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label={trainee.status || 'active'} 
                      color={trainee.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEdit(trainee)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(trainee._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
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
                {t('trainee.noTraineesFound')}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTrainee ? t('trainee.editTrainee') : t('trainee.addTrainee')}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t('trainee.name')}
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label={t('trainee.email')}
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label={t('trainee.phone')}
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>{t('trainee.level')}</InputLabel>
              <Select
                value={formData.level}
                label={t('trainee.level')}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
              >
                <MenuItem value="beginner">{t('trainee.level.beginner')}</MenuItem>
                <MenuItem value="intermediate">{t('trainee.level.intermediate')}</MenuItem>
                <MenuItem value="advanced">{t('trainee.level.advanced')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label={t('trainee.preferredDiscipline')}
              fullWidth
              value={formData.preferredDiscipline}
              onChange={(e) =>
                setFormData({ ...formData, preferredDiscipline: e.target.value })
              }
              required
            />
            <TextField
              margin="dense"
              label={t('trainee.emergencyContact')}
              fullWidth
              value={formData.emergencyContact}
              onChange={(e) =>
                setFormData({ ...formData, emergencyContact: e.target.value })
              }
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            <Button type="submit" color="primary">
              {selectedTrainee ? t('common.save') : t('common.add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TraineeList;
