import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ukmik.utdi.ac.id/api',
});

export default axiosInstance;
