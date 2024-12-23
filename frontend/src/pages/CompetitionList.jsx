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
      console.log('Competition response:', response);
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
    if (window.confirm('Are you sure you want to delete this competition?')) {
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
        <Typography>Loading competitions...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading competitions. Please try again later.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Competition Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add New Competition
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
                    {competition.type} - {competition.level}
                  </Typography>
                </Box>
                <Typography color="textSecondary" sx={{ mt: 1 }}>
                  Entry Fee: ${competition.entryFee}
                </Typography>
                <Typography color="textSecondary">
                  Max Participants: {competition.maxParticipants}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpen(competition)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(competition._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedCompetition ? 'Edit Competition' : 'Add New Competition'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="dressage">Dressage</MenuItem>
                <MenuItem value="jumping">Jumping</MenuItem>
                <MenuItem value="eventing">Eventing</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Level</InputLabel>
              <Select
                value={formData.level}
                label="Level"
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Max Participants"
              name="maxParticipants"
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Entry Fee"
              name="entryFee"
              type="number"
              value={formData.entryFee}
              onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedCompetition ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CompetitionList;
