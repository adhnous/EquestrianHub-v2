import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import backgroundImage from '../assets/images/horse-forest.jpg';

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const handleLanguageToggle = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      />
      <Card
        sx={{
          maxWidth: 600,
          width: '90%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h4" 
              component="div" 
              gutterBottom
              sx={{ 
                fontFamily: i18n.language === 'ar' ? 'Cairo, sans-serif' : 'inherit',
                fontWeight: 600
              }}
            >
              {t('university.name')}
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              gutterBottom
              sx={{ 
                fontFamily: i18n.language === 'ar' ? 'Cairo, sans-serif' : 'inherit'
              }}
            >
              {t('faculty.name')}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              gutterBottom
              sx={{ 
                fontFamily: i18n.language === 'ar' ? 'Cairo, sans-serif' : 'inherit'
              }}
            >
              {t('project.title')}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                fontFamily: i18n.language === 'ar' ? 'Cairo, sans-serif' : 'inherit'
              }}
            >
              {t('project.description')}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontFamily: i18n.language === 'ar' ? 'Cairo, sans-serif' : 'inherit'
              }}
            >
              {t('project.students')}:
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontFamily: i18n.language === 'ar' ? 'Cairo, sans-serif' : 'inherit'
              }}
            >
              {t('project.student1')}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontFamily: i18n.language === 'ar' ? 'Cairo, sans-serif' : 'inherit'
              }}
            >
              {t('project.student2')}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 1,
                fontFamily: i18n.language === 'ar' ? 'Cairo, sans-serif' : 'inherit'
              }}
            >
              {t('project.supervisor')}: {t('project.supervisorName')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
              sx={{ 
                minWidth: 120,
                fontFamily: i18n.language === 'ar' ? 'Cairo, sans-serif' : 'inherit'
              }}
            >
              {t('auth.login')}
            </Button>
            <Button
              variant="outlined"
              onClick={handleLanguageToggle}
              sx={{ 
                minWidth: 120,
                fontFamily: i18n.language === 'ar' ? 'Cairo, sans-serif' : 'inherit'
              }}
            >
              {i18n.language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LandingPage;
