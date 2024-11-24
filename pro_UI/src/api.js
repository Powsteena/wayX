// src/api.js
import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api/admin', // Adjust the base URL as needed
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

// Add a request interceptor to include the token in each request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Fetch users
export const fetchUsers = () => api.get('/users');

// Fetch drivers
export const fetchDrivers = () => api.get('/drivers');

// Update user
export const updateUser = (id, data) => api.patch(`/user/${id}`, data);

// Delete user
export const deleteUser = (id) => api.delete(`/user/${id}`);
