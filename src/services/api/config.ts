import axios from 'axios';
import { API_BASE_URL } from '../../config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.error('Resource not found:', error.response?.data);
    }
    return Promise.reject(error);
  }
);