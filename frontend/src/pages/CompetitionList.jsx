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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format } from 'date-fns';
import { getCompetitions, createCompetition, updateCompetition, deleteCompetition } from '../services/api';

const CompetitionList = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    type: 'dressage',
    level: 'beginner',
    maxParticipants: '',
    entryFee: '',
    description: '',
  });

  const queryClient = useQueryClient();

  const { data: competitions = [], isLoading, error } = useQuery(
    'competitions',
    async () => {
      const response = await getCompetitions();
      if (response?.data?.success) {
        return response.data.competitions || [];
      }
      return response?.data || [];
    },
    {
      onError: (error) => {
        console.error('Error fetching competitions:', error);
      }
    }
  );

  const createMutation = useMutation(
    (newCompetition) => createCompetition(newCompetition),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('competitions');
        handleClose();
      },
    }
  );

  const updateMutation = useMutation(
    (updatedCompetition) => updateCompetition(updatedCompetition.id, updatedCompetition),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('competitions');
        handleClose();
      },
    }
  );

  const deleteMutation = useMutation(
    (competitionId) => deleteCompetition(competitionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('competitions');
      },
    }
  );

  const handleOpen = (competition = null) => {
    if (competition) {
      setSelectedCompetition(competition);
      setFormData({
        name: competition.name,
        date: competition.date ? competition.date.split('T')[0] : '',
        location: competition.location,
        type: competition.type,
        level: competition.level,
        maxParticipants: competition.maxParticipants,
        entryFee: competition.entryFee,
        description: competition.description,
      });
    } else {
      setSelectedCompetition(null);
      setFormData({
        name: '',
        date: '',
        location: '',
        type: 'dressage',
        level: 'beginner',
        maxParticipants: '',
        entryFee: '',
        description: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCompetition(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCompetition) {
        updateMutation.mutate({ ...formData, id: selectedCompetition._id });
      } else {
        createMutation.mutate(formData);
      }
    } catch (error) {
      console.error('Error saving competition:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('competition.confirmDelete'))) {
      try {
        deleteMutation.mutate(id);
      } catch (error) {
        console.error('Error deleting competition:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t('errors.somethingWentWrong')}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('common.competitions')}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          {t('competition.addCompetition')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {competitions.map((competition) => (
          <Grid item xs={12} sm={6} md={4} key={competition._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{competition.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <EventIcon sx={{ mr: 1 }} />
                  <Typography color="textSecondary">
                    {format(new Date(competition.date), 'PPP')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LocationIcon sx={{ mr: 1 }} />
                  <Typography color="textSecondary">{competition.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrophyIcon sx={{ mr: 1 }} />
                  <Typography color="textSecondary">
                    {t(`competition.types.${competition.type}`)} - {t(`competition.levels.${competition.level}`)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton onClick={() => handleOpen(competition)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(competition._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCompetition ? t('competition.editCompetition') : t('competition.addCompetition')}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              name="name"
              label={t('competition.competitionName')}
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              name="date"
              label={t('competition.competitionDate')}
              type="date"
              fullWidth
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              name="location"
              label={t('competition.competitionLocation')}
              fullWidth
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>{t('competition.competitionType')}</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                {Object.keys(t('competition.types', { returnObjects: true })).map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`competition.types.${type}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>{t('competition.competitionLevel')}</InputLabel>
              <Select
                name="level"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                required
              >
                {Object.keys(t('competition.levels', { returnObjects: true })).map((level) => (
                  <MenuItem key={level} value={level}>
                    {t(`competition.levels.${level}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="maxParticipants"
              label={t('competition.maxParticipants')}
              type="number"
              fullWidth
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              name="entryFee"
              label={t('competition.entryFee')}
              type="number"
              fullWidth
              value={formData.entryFee}
              onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label={t('competition.description')}
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

export default CompetitionList;
