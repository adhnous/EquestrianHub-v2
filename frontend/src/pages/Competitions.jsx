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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { getCompetitions, createCompetition, updateCompetition, deleteCompetition } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const STATUSES = ['upcoming', 'ongoing', 'completed'];

const Competitions = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    level: 'beginner',
    maxParticipants: '',
    description: '',
    status: 'upcoming',
  });

  const { data, isLoading, error: queryError } = useQuery(
    'competitions',
    async () => {
      const response = await getCompetitions();
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5000
    }
  );

  const competitions = data?.competitions || [];

  const createMutation = useMutation(createCompetition, {
    onSuccess: () => {
      queryClient.invalidateQueries('competitions');
      handleClose();
    },
    onError: (error) => {
      setError(error.response?.data?.message || t('competition.error.failedToSave'));
    },
  });

  const updateMutation = useMutation(
    ({ id, data }) => updateCompetition(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('competitions');
        handleClose();
      },
      onError: (error) => {
        setError(error.response?.data?.message || t('competition.error.failedToSave'));
      },
    }
  );

  const deleteMutation = useMutation(deleteCompetition, {
    onSuccess: () => {
      queryClient.invalidateQueries('competitions');
    },
    onError: (error) => {
      setError(error.response?.data?.message || t('competition.error.failedToDelete'));
    },
  });

  const handleOpen = (competition = null) => {
    if (competition) {
      setSelectedCompetition(competition);
      setFormData({
        name: competition.name || '',
        date: competition.date?.split('T')[0] || '',
        level: competition.level || 'beginner',
        maxParticipants: competition.maxParticipants || '',
        description: competition.description || '',
        status: competition.status || 'upcoming',
      });
    } else {
      setSelectedCompetition(null);
      setFormData({
        name: '',
        date: '',
        level: 'beginner',
        maxParticipants: '',
        description: '',
        status: 'upcoming',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCompetition(null);
    setError(null);
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
      if (selectedCompetition) {
        await updateMutation.mutateAsync({
          id: selectedCompetition._id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('competition.confirmDelete'))) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Error deleting competition:', err);
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
          {t('competition.error.failedToLoad')}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('competition.title')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          {t('competition.addCompetition')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {!competitions || competitions.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                {t('competition.noCompetitionsFound')}
              </Typography>
            </Paper>
          </Grid>
        ) : (
          competitions.map((competition) => (
            <Grid item xs={12} sm={6} md={4} key={competition._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {competition.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {new Date(competition.date).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {t('competition.level')}: {t(`competition.levels.${competition.level}`)}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {t('competition.maxParticipants')}: {competition.maxParticipants}
                    </Typography>
                    <Typography variant="body2">
                      {t('competition.status.label')}: {t(`competition.status.${competition.status}`)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(competition)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(competition._id)}
                    color="error"
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
          {selectedCompetition ? t('competition.editCompetition') : t('competition.addCompetition')}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              margin="dense"
              name="name"
              label={t('competition.name')}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="date"
              label={t('competition.date')}
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="dense"
              name="level"
              label={t('competition.level')}
              select
              value={formData.level}
              onChange={handleChange}
              required
            >
              {LEVELS.map((level) => (
                <MenuItem key={level} value={level}>
                  {t(`competition.levels.${level}`)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="dense"
              name="maxParticipants"
              label={t('competition.maxParticipants')}
              type="number"
              value={formData.maxParticipants}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="status"
              label={t('competition.status.label')}
              select
              value={formData.status}
              onChange={handleChange}
              required
            >
              {STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`competition.status.${status}`)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="dense"
              name="description"
              label={t('competition.description')}
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
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
};

export default Competitions;
