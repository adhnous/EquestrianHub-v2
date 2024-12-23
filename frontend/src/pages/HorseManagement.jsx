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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Pets as HorseIcon,
  CalendarMonth as AgeIcon,
  ColorLens as ColorIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getHorses, createHorse, updateHorse, deleteHorse } from '../services/api';

const HorseManagement = () => {
  const [open, setOpen] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    color: '',
    gender: 'mare',
    registrationNumber: '',
    healthStatus: 'healthy',
    specialNeeds: '',
    owner: '',
  });

  const queryClient = useQueryClient();

  const { data: horses, isLoading } = useQuery(
    'horses',
    async () => {
      const response = await getHorses();
      console.log('Horses response:', response);
      if (response?.data?.success) {
        return response.data.horses || [];
      }
      throw new Error(response?.data?.message || 'Failed to fetch horses');
    },
    {
      onError: (error) => {
        console.error('Error fetching horses:', error);
        setError(error.message || 'Failed to fetch horses');
      }
    }
  );

  const createMutation = useMutation(
    async (newHorse) => {
      const response = await createHorse(newHorse);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create horse');
      }
      return response.data.horse;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('horses');
        handleClose();
      }
    }
  );

  const updateMutation = useMutation(
    async ({ id, data }) => {
      const response = await updateHorse(id, data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update horse');
      }
      return response.data.horse;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('horses');
        handleClose();
      }
    }
  );

  const deleteMutation = useMutation(
    async (id) => {
      const response = await deleteHorse(id);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete horse');
      }
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('horses');
      }
    }
  );

  const handleOpen = (horse = null) => {
    if (horse) {
      setSelectedHorse(horse);
      setFormData({
        name: horse.name,
        breed: horse.breed,
        age: horse.age,
        color: horse.color,
        gender: horse.gender,
        registrationNumber: horse.registrationNumber,
        healthStatus: horse.healthStatus,
        specialNeeds: horse.specialNeeds || '',
        owner: horse.owner,
      });
    } else {
      setSelectedHorse(null);
      setFormData({
        name: '',
        breed: '',
        age: '',
        color: '',
        gender: 'mare',
        registrationNumber: '',
        healthStatus: 'healthy',
        specialNeeds: '',
        owner: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedHorse(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedHorse) {
        await updateMutation.mutate({ id: selectedHorse._id, data: formData });
      } else {
        await createMutation.mutate(formData);
      }
    } catch (error) {
      console.error('Error saving horse:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this horse?')) {
      try {
        await deleteMutation.mutate(id);
      } catch (error) {
        console.error('Error deleting horse:', error);
        setError(error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const horsesList = horses || [];

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Horse Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add New Horse
        </Button>
      </Box>

      <Grid container spacing={3}>
        {horsesList.map((horse) => (
          <Grid item xs={12} sm={6} md={4} key={horse._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{horse.name}</Typography>
                  <Box>
                    <IconButton onClick={() => handleOpen(horse)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(horse._id)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <HorseIcon sx={{ mr: 1 }} />
                  <Typography>{horse.breed}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AgeIcon sx={{ mr: 1 }} />
                  <Typography>{horse.age} years old</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ColorIcon sx={{ mr: 1 }} />
                  <Typography>{horse.color}</Typography>
                </Box>

                <Typography color="textSecondary" sx={{ mt: 1 }}>
                  Health Status: {horse.healthStatus}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedHorse ? 'Edit Horse' : 'Add New Horse'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                    required
                  >
                    <MenuItem value="mare">Mare</MenuItem>
                    <MenuItem value="stallion">Stallion</MenuItem>
                    <MenuItem value="gelding">Gelding</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Registration Number"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Health Status</InputLabel>
                  <Select
                    name="healthStatus"
                    value={formData.healthStatus}
                    onChange={handleChange}
                    label="Health Status"
                    required
                  >
                    <MenuItem value="healthy">Healthy</MenuItem>
                    <MenuItem value="injured">Injured</MenuItem>
                    <MenuItem value="sick">Sick</MenuItem>
                    <MenuItem value="recovery">Recovery</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Owner"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Special Needs"
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {createMutation.isLoading || updateMutation.isLoading ? (
                <CircularProgress size={24} />
              ) : (
                selectedHorse ? 'Update' : 'Create'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default HorseManagement;
