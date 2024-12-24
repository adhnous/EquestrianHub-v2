import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import theme, { createRtlTheme, createRtlCache } from './theme';
import './i18n';

// Lazy load components
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Trainees = React.lazy(() => import('./pages/Trainees'));
const Trainers = React.lazy(() => import('./pages/Trainers'));
const Competitions = React.lazy(() => import('./pages/Competitions'));
const TrainingClasses = React.lazy(() => import('./pages/TrainingClasses'));
const HorseManagement = React.lazy(() => import('./pages/HorseManagement'));
const Profile = React.lazy(() => import('./pages/Profile'));
const MainLayout = React.lazy(() => import('./layouts/MainLayout'));

// Create rtl cache
const rtlCache = createRtlCache();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 1000,
    },
  },
});

function App() {
  const { i18n } = useTranslation();
  const [currentTheme, setCurrentTheme] = React.useState(theme);

  useEffect(() => {
    // Update theme direction based on language
    const isRtl = i18n.language === 'ar';
    document.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    setCurrentTheme(isRtl ? createRtlTheme() : theme);
  }, [i18n.language]);

  // Initialize language
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'ar';
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={currentTheme}>
          <CssBaseline />
          <BrowserRouter>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="trainees" element={<Trainees />} />
                  <Route path="trainers" element={<Trainers />} />
                  <Route path="competitions" element={<Competitions />} />
                  <Route path="training-classes" element={<TrainingClasses />} />
                  <Route path="horses" element={<HorseManagement />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Routes>
            </React.Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}

export default App;
