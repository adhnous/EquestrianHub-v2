import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Trainers = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    certifications: '',
    bio: '',
  });

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error: queryError
  } = useQuery('trainers', async () => {
    const response = await getTrainers();
    return response.data;
  });

  const handleOpen = (trainer = null) => {
    if (trainer) {
      setSelectedTrainer(trainer);
      setFormData(trainer);
    } else {
      setSelectedTrainer(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: '',
        certifications: '',
        bio: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTrainer(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTrainer) {
        await updateTrainer(selectedTrainer._id, formData);
      } else {
        await createTrainer(formData);
      }
      queryClient.invalidateQueries('trainers');
      handleClose();
    } catch (error) {
      console.error('Error saving trainer:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('trainer.confirmDelete'))) {
      try {
        await deleteTrainer(id);
        queryClient.invalidateQueries('trainers');
      } catch (error) {
        console.error('Error deleting trainer:', error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (queryError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {t('trainer.error.failedToLoad')}
        </Alert>
      </Box>
    );
  }

  const trainers = data?.trainers || [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('trainer.title')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          {t('trainer.addTrainer')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('common.name')}</TableCell>
              <TableCell>{t('common.email')}</TableCell>
              <TableCell>{t('trainer.phone')}</TableCell>
              <TableCell>{t('trainer.specialization')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainers.map((trainer) => (
              <TableRow key={trainer._id}>
                <TableCell>
                  {`${trainer.firstName} ${trainer.lastName}`}
                </TableCell>
                <TableCell>{trainer.email}</TableCell>
                <TableCell>{trainer.phone}</TableCell>
                <TableCell>{trainer.specialization}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpen(trainer)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(trainer._id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedTrainer ? t('trainer.editTrainer') : t('trainer.addTrainer')}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              name="firstName"
              label={t('trainer.firstName')}
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="lastName"
              label={t('trainer.lastName')}
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="email"
              label={t('common.email')}
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="phone"
              label={t('trainer.phone')}
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="specialization"
              label={t('trainer.specialization')}
              value={formData.specialization}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              name="certifications"
              label={t('trainer.certifications')}
              value={formData.certifications}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              name="bio"
              label={t('trainer.bio')}
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            <Button type="submit" variant="contained">
              {t('common.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Trainers;
