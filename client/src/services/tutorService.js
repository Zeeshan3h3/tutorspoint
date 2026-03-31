import api from './api';

export const getAllTutors = () => api.get('/tutor/all');
export const getTutorById = (id) => api.get(`/tutor/${id}`);
export const createTutorProfile = (data) => api.post('/tutor/create', data);
export const updateTutorProfile = (data) => api.put('/tutor/update', data);
