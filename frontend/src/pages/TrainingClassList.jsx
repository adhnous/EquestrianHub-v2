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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format } from 'date-fns';
import { 
  getTrainingClasses, 
  createTrainingClass, 
  updateTrainingClass, 
  deleteTrainingClass,
  getTrainers 
} from '../services/api';

const TrainingClassList = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'dressage',
    level: 'beginner',
    trainer: '',
    maxParticipants: 8,
    price: {
      amount: '',
      currency: 'USD'
    },
    schedule: {
      time: '',
      days: [],
      startDate: '',
      endDate: ''
    }
  });

  const queryClient = useQueryClient();

  const { data: classesData, isLoading: classesLoading } = useQuery(
    'training-classes',
    async () => {
      const response = await getTrainingClasses();
      console.log('Training Classes Response:', response);
      return response.data;
    },
    {
      onError: (error) => {
        console.error('Error fetching training classes:', error);
        setError(error.response?.data?.message || t('trainingClass.error.fetchFailed'));
      }
    }
  );

  const { data: trainersData, isLoading: trainersLoading } = useQuery(
    'trainers',
    async () => {
      const response = await getTrainers();
      console.log('Trainers Response:', response);
      return response.data;
    },
    {
      onError: (error) => {
        console.error('Error fetching trainers:', error);
        setError(error.response?.data?.message || t('trainers.error.fetchFailed'));
      }
    }
  );

  const createMutation = useMutation(createTrainingClass, {
    onSuccess: () => {
      queryClient.invalidateQueries('training-classes');
      handleClose();
    },
    onError: (error) => {
      setError(error.response?.data?.message || t('trainingClass.error.createFailed'));
    },
  });

  const updateMutation = useMutation(
    ({ id, data }) => updateTrainingClass(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('training-classes');
        handleClose();
      },
      onError: (error) => {
        setError(error.response?.data?.message || t('trainingClass.error.updateFailed'));
      },
    }
  );

  const deleteMutation = useMutation(deleteTrainingClass, {
    onSuccess: () => {
      queryClient.invalidateQueries('training-classes');
    },
    onError: (error) => {
      setError(error.response?.data?.message || t('trainingClass.error.deleteFailed'));
    },
  });

  const handleOpen = (classItem = null) => {
    if (classItem) {
      setSelectedClass(classItem);
      setFormData({
        name: classItem.name,
        description: classItem.description,
        type: classItem.type,
        level: classItem.level,
        trainer: classItem.trainer?._id || '',
        maxParticipants: classItem.maxParticipants,
        price: classItem.price || { amount: '', currency: 'USD' },
        schedule: classItem.schedule || {
          time: '',
          days: [],
          startDate: '',
          endDate: ''
        }
      });
    } else {
      setSelectedClass(null);
      setFormData({
        name: '',
        description: '',
        type: 'dressage',
        level: 'beginner',
        trainer: '',
        maxParticipants: 8,
        price: {
          amount: '',
          currency: 'USD'
        },
        schedule: {
          time: '',
          days: [],
          startDate: '',
          endDate: ''
        }
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedClass(null);
    setError(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedClass) {
      updateMutation.mutate({
        id: selectedClass._id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(t('trainingClass.confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  if (classesLoading || trainersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  console.log('Classes Data:', classesData);
  console.log('Trainers Data:', trainersData);

  const classes = Array.isArray(classesData) ? classesData : [];
  const trainers = Array.isArray(trainersData) ? trainersData : [];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {t('trainingClass.title')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedClass(null);
            setFormData({
              name: '',
              description: '',
              type: 'dressage',
              level: 'beginner',
              trainer: '',
              maxParticipants: 8,
              price: {
                amount: '',
                currency: 'USD'
              },
              schedule: {
                time: '',
                days: [],
                startDate: '',
                endDate: ''
              }
            });
            setOpen(true);
          }}
        >
          {t('trainingClass.addNew')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {classes.map((classItem) => (
          <Grid item xs={12} sm={6} md={4} key={classItem._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {classItem.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {classItem.description}
                </Typography>
                <Box display="flex" gap={1} mb={1}>
                  <Chip
                    icon={<SchoolIcon />}
                    label={t(`trainingClass.level.${classItem.level}`)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    icon={<GroupIcon />}
                    label={`${classItem.enrolledTrainees?.length || 0}/${classItem.maxParticipants}`}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  <strong>{t('trainingClass.type')}:</strong> {t(`trainingClass.types.${classItem.type}`)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>{t('trainingClass.trainer')}:</strong> {classItem.trainer?.username}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>{t('trainingClass.price')}:</strong> ${classItem.price?.amount} {classItem.price?.currency}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setSelectedClass(classItem);
                    setFormData({
                      name: classItem.name,
                      description: classItem.description,
                      type: classItem.type,
                      level: classItem.level,
                      trainer: classItem.trainer?._id,
                      maxParticipants: classItem.maxParticipants,
                      price: {
                        amount: classItem.price?.amount || '',
                        currency: classItem.price?.currency || 'USD'
                      },
                      schedule: {
                        time: classItem.schedule?.time || '',
                        days: classItem.schedule?.days || [],
                        startDate: classItem.schedule?.startDate || '',
                        endDate: classItem.schedule?.endDate || ''
                      }
                    });
                    setOpen(true);
                  }}
                >
                  {t('common.edit')}
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    if (window.confirm(t('trainingClass.deleteConfirm'))) {
                      deleteMutation.mutate(classItem._id);
                    }
                  }}
                >
                  {t('common.delete')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedClass ? t('trainingClass.editClass') : t('trainingClass.addNew')}
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
                name="description"
                label={t('common.description')}
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel>{t('trainingClass.type')}</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label={t('trainingClass.type')}
                >
                  {['dressage', 'jumping', 'western'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {t(`trainingClass.types.${type}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>{t('common.level')}</InputLabel>
                <Select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  label={t('common.level')}
                >
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <MenuItem key={level} value={level}>
                      {t(`trainingClass.levels.${level}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>{t('trainingClass.trainer')}</InputLabel>
                <Select
                  name="trainer"
                  value={formData.trainer}
                  onChange={handleChange}
                  label={t('trainingClass.trainer')}
                >
                  {trainers.map((trainer) => (
                    <MenuItem key={trainer._id} value={trainer._id}>
                      {trainer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="maxParticipants"
                label={t('trainingClass.maxParticipants')}
                type="number"
                value={formData.maxParticipants}
                onChange={handleChange}
                required
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
              />
              <TextField
                name="price.amount"
                label={t('trainingClass.price')}
                type="number"
                value={formData.price.amount}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  price: { ...prev.price, amount: e.target.value }
                }))}
                required
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            <Button
              type="submit"
              variant="contained"
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

export default TrainingClassList;
