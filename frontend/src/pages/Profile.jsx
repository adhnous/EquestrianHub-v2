import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from 'react-query';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
  TextField,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { getProfile, updateProfile, changePassword } from '../services/api';
import useAuthStore from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    bio: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { data: profile, isLoading, refetch } = useQuery('profile', getProfile, {
    onSuccess: (data) => {
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        emergencyContact: data.emergencyContact || '',
        bio: data.bio || '',
      });
    },
  });

  const updateProfileMutation = useMutation(updateProfile, {
    onSuccess: () => {
      setSuccessMessage(t('profile.updateSuccess'));
      setEditMode(false);
      refetch();
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      setErrorMessage(error.message || t('errors.somethingWentWrong'));
      setTimeout(() => setErrorMessage(''), 3000);
    },
  });

  const changePasswordMutation = useMutation(changePassword, {
    onSuccess: () => {
      setSuccessMessage(t('profile.passwordChangeSuccess'));
      setPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      setErrorMessage(error.message || t('errors.somethingWentWrong'));
      setTimeout(() => setErrorMessage(''), 3000);
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage(t('errors.passwordMismatch'));
      return;
    }
    changePasswordMutation.mutate(passwordData);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 100, height: 100, mr: 2 }}>
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Box>
            <Typography variant="h4">
              {formData.firstName} {formData.lastName}
            </Typography>
            <Typography color="textSecondary">{formData.email}</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{t('profile.personalInformation')}</Typography>
            <Box>
              <Button
                startIcon={<EditIcon />}
                onClick={() => setEditMode(!editMode)}
                sx={{ mr: 1 }}
              >
                {t('profile.editProfile')}
              </Button>
              <Button
                startIcon={<LockIcon />}
                onClick={() => setPasswordDialog(true)}
              >
                {t('profile.changePassword')}
              </Button>
            </Box>
          </Box>
          <Divider />
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('profile.firstName')}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('profile.lastName')}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('profile.email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('profile.phone')}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('profile.address')}
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editMode}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('profile.emergencyContact')}
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('profile.bio')}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!editMode}
                multiline
                rows={4}
              />
            </Grid>
            {editMode && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    onClick={() => setEditMode(false)}
                    sx={{ mr: 1 }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {t('common.save')}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>

      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>{t('profile.changePassword')}</DialogTitle>
        <form onSubmit={handlePasswordSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label={t('profile.currentPassword')}
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label={t('profile.newPassword')}
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label={t('profile.confirmPassword')}
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {t('common.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Profile;
