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
  const { t } = useTranslation();
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

  const { data: horses, isLoading } = useQuery('horses', getHorses);

  const createMutation = useMutation(createHorse, {
    onSuccess: () => {
      queryClient.invalidateQueries('horses');
      handleClose();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const updateMutation = useMutation(updateHorse, {
    onSuccess: () => {
      queryClient.invalidateQueries('horses');
      handleClose();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const deleteMutation = useMutation(deleteHorse, {
    onSuccess: () => {
      queryClient.invalidateQueries('horses');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleClickOpen = () => {
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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleEdit = (horse) => {
    setSelectedHorse(horse);
    setFormData(horse);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('common.confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedHorse) {
      updateMutation.mutate({ id: selectedHorse._id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {t('horse.management')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          {t('horse.addHorse')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {horses?.data?.horses?.map((horse) => (
          <Grid item xs={12} sm={6} md={4} key={horse._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="flex-end">
                  <IconButton size="small" onClick={() => handleEdit(horse)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(horse._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Typography variant="h6" component="div" align="right">
                  {horse.name}
                </Typography>
                <Box display="flex" flexDirection="column" alignItems="flex-end" mt={1}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      {horse.breed}
                    </Typography>
                    <HorseIcon sx={{ ml: 1 }} />
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      {t('horse.yearsOld', { count: horse.age })}
                    </Typography>
                    <AgeIcon sx={{ ml: 1 }} />
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      {horse.color}
                    </Typography>
                    <ColorIcon sx={{ ml: 1 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('horse.healthStatus')}: {t(`horse.status.${horse.healthStatus}`)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedHorse ? t('horse.editHorse') : t('horse.addHorse')}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t('common.name')}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t('horse.breed')}
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t('horse.age')}
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t('horse.color')}
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{t('horse.gender')}</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label={t('horse.gender')}
                  >
                    <MenuItem value="mare">{t('horse.genders.mare')}</MenuItem>
                    <MenuItem value="stallion">{t('horse.genders.stallion')}</MenuItem>
                    <MenuItem value="gelding">{t('horse.genders.gelding')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('horse.registrationNumber')}
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{t('horse.healthStatus')}</InputLabel>
                  <Select
                    name="healthStatus"
                    value={formData.healthStatus}
                    onChange={handleChange}
                    label={t('horse.healthStatus')}
                  >
                    <MenuItem value="healthy">{t('horse.status.healthy')}</MenuItem>
                    <MenuItem value="sick">{t('horse.status.sick')}</MenuItem>
                    <MenuItem value="recovery">{t('horse.status.recovery')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t('horse.specialNeeds')}
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t('horse.owner')}
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedHorse ? t('common.save') : t('common.add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default HorseManagement;
