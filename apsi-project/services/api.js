import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5053/products',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
