import axios from 'axios';

// Set up the base URL for all Axios requests
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export default api;
