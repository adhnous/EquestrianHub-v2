import axios from 'axios';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
  withCredentials: true
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
const login = (credentials) => api.post('/auth/login', credentials);
const logout = () => api.post('/auth/logout');

// Training Class endpoints
const getTrainingClasses = () => api.get('/training-classes');
const getTrainingClass = (id) => api.get(`/training-classes/${id}`);
const createTrainingClass = (data) => api.post('/training-classes', data);
const updateTrainingClass = (id, data) => api.put(`/training-classes/${id}`, data);
const deleteTrainingClass = (id) => api.delete(`/training-classes/${id}`);
const enrollInClass = (id, data) => api.post(`/training-classes/${id}/enroll`, data);
const updateSessionAttendance = (classId, sessionId, data) => 
  api.put(`/training-classes/${classId}/sessions/${sessionId}/attendance`, data);
const updateSession = (classId, sessionId, data) => 
  api.put(`/training-classes/${classId}/sessions/${sessionId}`, data);

// Competition endpoints
const getCompetitions = () => api.get('/competitions');
const getCompetition = (id) => api.get(`/competitions/${id}`);
const createCompetition = (data) => api.post('/competitions', data);
const updateCompetition = (id, data) => api.put(`/competitions/${id}`, data);
const deleteCompetition = (id) => api.delete(`/competitions/${id}`);
const registerForCompetition = (id, data) => api.post(`/competitions/${id}/register`, data);
const updateCompetitionResults = (id, data) => api.put(`/competitions/${id}/results`, data);

// Trainee endpoints
const getTrainees = () => api.get('/trainees');
const getTrainee = (id) => api.get(`/trainees/${id}`);
const createTrainee = (data) => api.post('/trainees', data);
const updateTrainee = (id, data) => api.put(`/trainees/${id}`, data);
const deleteTrainee = (id) => api.delete(`/trainees/${id}`);

// Trainer endpoints
const getTrainers = () => api.get('/trainers');
const getTrainer = (id) => api.get(`/trainers/${id}`);
const createTrainer = (data) => api.post('/trainers', data);
const updateTrainer = (id, data) => api.put(`/trainers/${id}`, data);
const deleteTrainer = (id) => api.delete(`/trainers/${id}`);

// Horse endpoints
const getHorses = () => api.get('/horses');
const getHorse = (id) => api.get(`/horses/${id}`);
const createHorse = (data) => api.post('/horses', data);
const updateHorse = (id, data) => api.put(`/horses/${id}`, data);
const deleteHorse = (id) => api.delete(`/horses/${id}`);

// Profile endpoints
const getProfile = () => api.get('/profile');
const updateProfile = (data) => api.put('/profile', data);
const changePassword = (data) => api.put('/profile/password', data);

export {
  // Auth
  login,
  logout,
  
  // Training Classes
  getTrainingClasses,
  getTrainingClass,
  createTrainingClass,
  updateTrainingClass,
  deleteTrainingClass,
  enrollInClass,
  updateSessionAttendance,
  updateSession,
  
  // Competitions
  getCompetitions,
  getCompetition,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  registerForCompetition,
  updateCompetitionResults,
  
  // Trainees
  getTrainees,
  getTrainee,
  createTrainee,
  updateTrainee,
  deleteTrainee,
  
  // Trainers
  getTrainers,
  getTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  
  // Horses
  getHorses,
  getHorse,
  createHorse,
  updateHorse,
  deleteHorse,
  
  // Profile
  getProfile,
  updateProfile,
  changePassword
};
