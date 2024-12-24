import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import {
  getTrainingClasses,
  getTrainers,
  createTrainingClass,
  updateTrainingClass,
  deleteTrainingClass
} from '../services/api';

const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
    <CircularProgress />
  </Box>
);

const ErrorMessage = ({ error }) => (
  <Box sx={{ p: 3 }}>
    <Alert severity="error">
      {error.response?.data?.message || 'Something went wrong'}
    </Alert>
  </Box>
);

function TrainingClasses() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trainer: '',
    type: 'group',
    level: 'beginner',
    maxParticipants: '',
    price: '',
    startDate: '',
    endDate: '',
    schedule: {
      days: [],
      startTime: '',
      endTime: ''
    }
  });

  const { 
    data: trainersData, 
    isLoading: trainersLoading,
    error: trainersError 
  } = useQuery(
    'trainers',
    async () => {
      const response = await getTrainers();
      return response.data || [];
    }
  );

  const { 
    data: classesData, 
    isLoading: classesLoading,
    error: classesError,
    refetch: refetchClasses 
  } = useQuery(
    'trainingClasses',
    async () => {
      const response = await getTrainingClasses();
      return response.data || [];
    }
  );

  // Ensure we always have arrays and handle the data structure from the API
  const trainers = Array.isArray(trainersData) ? trainersData : [];
  const classes = Array.isArray(classesData) ? classesData.map(classItem => ({
    ...classItem,
    price: typeof classItem.price === 'string' ? parseFloat(classItem.price) : classItem.price,
    schedule: {
      days: Array.isArray(classItem.schedule?.days) ? classItem.schedule.days : [],
      startTime: classItem.schedule?.startTime || '',
      endTime: classItem.schedule?.endTime || ''
    }
  })) : [];

  const handleOpen = (classData = null) => {
    if (classData) {
      setSelectedClass(classData);
      setFormData({
        name: classData.name || '',
        description: classData.description || '',
        trainer: classData.trainer?._id || '',
        type: classData.type || 'group',
        level: classData.level || 'beginner',
        maxParticipants: classData.maxParticipants || '',
        price: classData.price || '',
        startDate: classData.startDate?.split('T')[0] || '',
        endDate: classData.endDate?.split('T')[0] || '',
        schedule: {
          days: classData.schedule?.days || [],
          startTime: classData.schedule?.startTime || '',
          endTime: classData.schedule?.endTime || ''
        }
      });
    } else {
      setSelectedClass(null);
      setFormData({
        name: '',
        description: '',
        trainer: '',
        type: 'group',
        level: 'beginner',
        maxParticipants: '',
        price: '',
        startDate: '',
        endDate: '',
        schedule: {
          days: [],
          startTime: '',
          endTime: ''
        }
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedClass(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('schedule.')) {
      const scheduleField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [scheduleField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const classData = {
        ...formData,
        price: Number(formData.price),
        maxParticipants: Number(formData.maxParticipants),
      };

      if (selectedClass) {
        await updateTrainingClass(selectedClass._id, classData);
      } else {
        await createTrainingClass(classData);
      }
      await refetchClasses();
      handleClose();
    } catch (error) {
      console.error('Error saving training class:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('trainingClass.confirmDelete'))) {
      try {
        await deleteTrainingClass(id);
        await refetchClasses();
      } catch (error) {
        console.error('Error deleting training class:', error);
      }
    }
  };

  if (trainersLoading || classesLoading) {
    return <LoadingSpinner />;
  }

  if (trainersError || classesError) {
    return <ErrorMessage error={trainersError || classesError} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ mr: 1, fontSize: 35 }} />
          {t('trainingClass.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          {t('trainingClass.addClass')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('common.name')}</TableCell>
              <TableCell>{t('trainingClass.trainer')}</TableCell>
              <TableCell>{t('common.type')}</TableCell>
              <TableCell>{t('common.level')}</TableCell>
              <TableCell>{t('common.schedule')}</TableCell>
              <TableCell>{t('common.price')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1">
                    {t('trainingClass.noClassesFound')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              classes.map((classItem) => (
                <TableRow key={classItem._id}>
                  <TableCell>{classItem.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      {classItem.trainer?.firstName} {classItem.trainer?.lastName}
                    </Box>
                  </TableCell>
                  <TableCell>{t(`trainingClass.type.${classItem.type}`)}</TableCell>
                  <TableCell>{t(`trainingClass.level.${classItem.level}`)}</TableCell>
                  <TableCell>
                    <Box>
                      {classItem.schedule?.days?.map(
                        (day) => (
                          <Chip
                            key={day}
                            label={t(`common.days.${day.toLowerCase()}`)}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        )
                      ) || null}
                    </Box>
                    <Typography variant="caption" display="block">
                      {classItem.schedule?.startTime || 'N/A'} - {classItem.schedule?.endTime || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {typeof classItem.price === 'number' ? 
                      `$${classItem.price}` :
                      typeof classItem.price === 'object' ? 
                        `$${classItem.price.amount} ${classItem.price.currency}${classItem.price.interval ? `/${classItem.price.interval}` : ''}` :
                        'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpen(classItem)}
                      color="primary"
                      title={t('common.edit')}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(classItem._id)}
                      color="error"
                      title={t('common.delete')}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedClass ? t('trainingClass.editClass') : t('trainingClass.addClass')}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              name="name"
              label={t('common.name')}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="description"
              label={t('common.description')}
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              name="trainer"
              label={t('trainingClass.trainer')}
              select
              value={formData.trainer}
              onChange={handleChange}
              required
            >
              {trainers.map((trainer) => (
                <MenuItem key={trainer._id} value={trainer._id}>
                  {`${trainer.firstName} ${trainer.lastName}`}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="dense"
              name="type"
              label={t('common.type')}
              select
              value={formData.type}
              onChange={handleChange}
              required
            >
              <MenuItem value="group">{t('trainingClass.type.group')}</MenuItem>
              <MenuItem value="private">{t('trainingClass.type.private')}</MenuItem>
              <MenuItem value="semi-private">{t('trainingClass.type.semiPrivate')}</MenuItem>
            </TextField>
            <TextField
              fullWidth
              margin="dense"
              name="level"
              label={t('common.level')}
              select
              value={formData.level}
              onChange={handleChange}
              required
            >
              <MenuItem value="beginner">{t('trainingClass.level.beginner')}</MenuItem>
              <MenuItem value="intermediate">{t('trainingClass.level.intermediate')}</MenuItem>
              <MenuItem value="advanced">{t('trainingClass.level.advanced')}</MenuItem>
            </TextField>
            <TextField
              fullWidth
              margin="dense"
              name="maxParticipants"
              label={t('trainingClass.maxParticipants')}
              type="number"
              value={formData.maxParticipants}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="price"
              label={t('common.price')}
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="startDate"
              label={t('trainingClass.startDate')}
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="dense"
              name="endDate"
              label={t('trainingClass.endDate')}
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="dense"
              name="schedule.startTime"
              label={t('trainingClass.schedule.startTime')}
              type="time"
              value={formData.schedule.startTime}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="dense"
              name="schedule.endTime"
              label={t('trainingClass.schedule.endTime')}
              type="time"
              value={formData.schedule.endTime}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="contained">
              {t('common.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default TrainingClasses;
