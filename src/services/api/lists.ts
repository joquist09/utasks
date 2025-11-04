import axios from 'axios';
import { api } from './config';
import { API_ROUTES } from '../../config';
import { List, CreateListDto, UpdateListDto } from '../../types';

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

export const listService = {
  getListsByBoardId: async (boardId: string): Promise<List[]> => {
    try {
      const response = await api.get<APIResponse<List[]>>(API_ROUTES.LISTS.ALL(boardId));
      
      if (!response.data.success) {
        throw new Error('Failed to fetch lists');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching lists:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to fetch lists');
      }
      throw error;
    }
  },

  getList: async (listId: string): Promise<List> => {
    try {
      const response = await api.get<APIResponse<List>>(API_ROUTES.LISTS.BY_ID(listId));
      
      if (!response.data.success) {
        throw new Error('Failed to fetch list');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching list:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to fetch list');
      }
      throw error;
    }
  },

  createList: async (data: CreateListDto): Promise<List> => {
    try {
      const response = await api.post<APIResponse<List>>(API_ROUTES.LISTS.BASE, {
        name: data.name,
        boardId: data.boardId,
      });
      
      if (!response.data.success) {
        throw new Error('Failed to create list');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating list:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        const errorMessage = apiError?.error || apiError?.errors?.[0]?.message || 'Failed to create list';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  updateList: async (listId: string, data: UpdateListDto): Promise<List> => {
    try {
      const response = await api.put<APIResponse<List>>(API_ROUTES.LISTS.BY_ID(listId), data);
      
      if (!response.data.success) {
        throw new Error('Failed to update list');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating list:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to update list');
      }
      throw error;
    }
  },

  deleteList: async (listId: string): Promise<void> => {
    try {
      await api.delete(API_ROUTES.LISTS.BY_ID(listId));
    } catch (error) {
      console.error('Error deleting list:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to delete list');
      }
      throw error;
    }
  },
};