import React, { useState } from 'react';
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
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
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
  deleteTrainingClass 
} from '../services/api';
import { getTrainers } from '../services/api';

const TrainingClassList = () => {
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
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
    location: '',
    schedule: {
      time: '',
      days: [],
      startDate: '',
      endDate: ''
    }
  });

  const queryClient = useQueryClient();

  const { data: classes = [], isLoading: classesLoading } = useQuery(
    'training-classes',
    async () => {
      const response = await getTrainingClasses();
      console.log('Training classes response:', response);
      return response.data.trainingClasses || [];
    },
    {
      onError: (error) => {
        console.error('Error fetching training classes:', error);
        setError(error.response?.data?.message || 'Failed to fetch training classes');
      }
    }
  );

  const { data: trainers = [], isLoading: trainersLoading } = useQuery(
    'trainers',
    async () => {
      const response = await getTrainers();
      console.log('Trainers response:', response);
      return response.data.trainers || [];
    },
    {
      onError: (error) => {
        console.error('Error fetching trainers:', error);
        setError(error.response?.data?.message || 'Failed to fetch trainers');
      }
    }
  );

  const createMutation = useMutation(
    async (newClass) => {
      const response = await createTrainingClass(newClass);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create training class');
      }
      return response.data.class;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('training-classes');
        handleClose();
      }
    }
  );

  const updateMutation = useMutation(
    async ({ id, data }) => {
      const response = await updateTrainingClass(id, data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update training class');
      }
      return response.data.class;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('training-classes');
        handleClose();
      }
    }
  );

  const deleteMutation = useMutation(
    async (id) => {
      const response = await deleteTrainingClass(id);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete training class');
      }
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('training-classes');
      }
    }
  );

  const handleOpen = (classItem = null) => {
    if (classItem) {
      setSelectedClass(classItem);
      setFormData({
        name: classItem.name,
        description: classItem.description,
        type: classItem.type,
        level: classItem.level,
        trainer: classItem.trainer._id,
        maxParticipants: classItem.maxParticipants,
        price: classItem.price,
        location: classItem.location,
        schedule: classItem.schedule
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
        location: '',
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedClass) {
      updateMutation.mutate({ id: selectedClass._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this training class?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (classesLoading || trainersLoading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Training Classes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add New Class
        </Button>
      </Box>

      <Grid container spacing={3}>
        {classes.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">
                  No training classes available
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Click the "Add New Class" button to create one
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          classes.map((classItem) => (
            <Grid item xs={12} sm={6} md={4} key={classItem._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="div">
                        {classItem.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {classItem.trainer?.username}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {classItem.schedule?.time} ({classItem.schedule?.days?.join(', ')})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <GroupIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Max Participants: {classItem.maxParticipants}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={classItem.type}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={classItem.level} 
                      color="secondary" 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {classItem.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    ${classItem.price?.amount} {classItem.price?.currency}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(classItem)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(classItem._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedClass ? 'Edit Training Class' : 'Add New Training Class'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <MenuItem value="dressage">Dressage</MenuItem>
                <MenuItem value="jumping">Show Jumping</MenuItem>
                <MenuItem value="eventing">Eventing</MenuItem>
                <MenuItem value="western">Western</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Level</InputLabel>
              <Select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Trainer</InputLabel>
              <Select
                name="trainer"
                value={formData.trainer}
                onChange={handleInputChange}
              >
                {trainers.map((trainer) => (
                  <MenuItem key={trainer._id} value={trainer._id}>
                    {trainer.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Maximum Participants"
              name="maxParticipants"
              type="number"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Price (USD)"
              name="price.amount"
              type="number"
              value={formData.price.amount}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Schedule Time"
              name="schedule.time"
              value={formData.schedule.time}
              onChange={handleInputChange}
              margin="normal"
              placeholder="e.g., 09:00-10:00"
            />
            <TextField
              fullWidth
              label="Schedule Days"
              name="schedule.days"
              value={formData.schedule.days.join(', ')}
              onChange={(e) => {
                const days = e.target.value.split(',').map(day => day.trim());
                setFormData({
                  ...formData,
                  schedule: {
                    ...formData.schedule,
                    days
                  }
                });
              }}
              margin="normal"
              placeholder="e.g., Monday, Wednesday"
            />
            <TextField
              fullWidth
              label="Start Date"
              name="schedule.startDate"
              type="date"
              value={formData.schedule.startDate}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date"
              name="schedule.endDate"
              type="date"
              value={formData.schedule.endDate}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedClass ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainingClassList;
