import axios from 'axios';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
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
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
const login = (credentials) => api.post('/login', credentials);
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

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

// User endpoints
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
const getHorses = () => {
  return api.get('/horses');
};

const getHorse = (id) => {
  return api.get(`/horses/${id}`);
};

const createHorse = (data) => {
  return api.post('/horses', data);
};

const updateHorse = (id, data) => {
  return api.put(`/horses/${id}`, data);
};

const deleteHorse = (id) => {
  return api.delete(`/horses/${id}`);
};

// Profile endpoints
const getProfile = () => api.get('/auth/profile');
const updateProfile = (data) => api.put('/auth/profile', data);
const changePassword = (data) => api.post('/auth/change-password', data);

export {
  login,
  logout,
  getTrainingClasses,
  getTrainingClass,
  createTrainingClass,
  updateTrainingClass,
  deleteTrainingClass,
  enrollInClass,
  updateSessionAttendance,
  updateSession,
  getCompetitions,
  getCompetition,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  registerForCompetition,
  updateCompetitionResults,
  getTrainees,
  getTrainee,
  createTrainee,
  updateTrainee,
  deleteTrainee,
  getTrainers,
  getTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getHorses,
  getHorse,
  createHorse,
  updateHorse,
  deleteHorse,
  getProfile,
  updateProfile,
  changePassword,
};
