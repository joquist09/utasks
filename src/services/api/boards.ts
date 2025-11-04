import axios from 'axios';
import { api } from './config';
import { API_ROUTES } from '../../config';
import { Board, CreateBoardDto, UpdateBoardDto } from '../../types';

type APIResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type APIError = {
  success: boolean;
  error?: string;
  errors?: Array<{ message: string; field: string }>;
};

export const boardService = {
  getBoardsByUserId: async (userId: string): Promise<Board[]> => {
    try {
      const response = await api.get<APIResponse<Board[]>>(API_ROUTES.BOARDS.BY_USER_ID(userId));
      
      if (!response.data.success) {
        throw new Error('Failed to fetch boards');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching boards:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to fetch boards');
      }
      throw error;
    }
  },

  getBoard: async (id: string): Promise<Board> => {
    try {
      const response = await api.get<APIResponse<Board>>(API_ROUTES.BOARDS.BY_ID(id));
      
      if (!response.data.success) {
        throw new Error('Failed to fetch board');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching board:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to fetch board');
      }
      throw error;
    }
  },

  createBoard: async (data: CreateBoardDto): Promise<Board> => {
    try {
      const response = await api.post<APIResponse<Board>>(API_ROUTES.BOARDS.BASE, data);
      
      if (!response.data.success) {
        throw new Error('Failed to create board');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating board:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to create board');
      }
      throw error;
    }
  },

  updateBoard: async (id: string, data: UpdateBoardDto): Promise<Board> => {
    try {
      const response = await api.put<APIResponse<Board>>(API_ROUTES.BOARDS.BY_ID(id), data);
      
      if (!response.data.success) {
        throw new Error('Failed to update board');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating board:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to update board');
      }
      throw error;
    }
  },

  deleteBoard: async (id: string): Promise<void> => {
    try {
      await api.delete(API_ROUTES.BOARDS.BY_ID(id));
    } catch (error) {
      console.error('Error deleting board:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to delete board');
      }
      throw error;
    }
  },
};