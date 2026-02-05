import axios from 'axios';

const api = axios.create({
  // Usamos la variable de entorno que definimos antes
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});

// Este es un "Interceptor": antes de mandar cualquier pedido, 
// se fija si tenemos un token guardado y lo pega en el header.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;