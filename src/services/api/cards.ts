import axios from 'axios';
import { api } from './config';
import { API_ROUTES } from '../../config';
import { Card, CreateCardDto, UpdateCardDto } from '../../types';

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

export const cardService = {
  getCardsByListId: async (listId: string): Promise<Card[]> => {
    try {
      const response = await api.get<APIResponse<Card[]>>(API_ROUTES.CARDS.ALL(listId));
      
      if (!response.data.success) {
        throw new Error('Failed to fetch cards');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cards:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to fetch cards');
      }
      throw error;
    }
  },

  getCard: async (cardId: string): Promise<Card> => {
    try {
      const response = await api.get<APIResponse<Card>>(API_ROUTES.CARDS.BY_ID(cardId));
      
      if (!response.data.success) {
        throw new Error('Failed to fetch card');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching card:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to fetch card');
      }
      throw error;
    }
  },

  createCard: async (data: CreateCardDto): Promise<Card> => {
    try {
      const requestBody = {
        title: data.title,
        listId: data.listId,
        description: data.description || 'No description',
        priority: data.priority || 1,
        dueDate: data.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      const response = await api.post<APIResponse<Card>>(API_ROUTES.CARDS.BASE, requestBody);
      
      if (!response.data.success) {
        throw new Error('Failed to create card');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating card:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        const errorMessage = apiError?.error || apiError?.errors?.[0]?.message || 'Failed to create card';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  updateCard: async (cardId: string, data: UpdateCardDto): Promise<Card> => {
    try {
      const response = await api.put<APIResponse<Card>>(API_ROUTES.CARDS.BY_ID(cardId), data);
      
      if (!response.data.success) {
        throw new Error('Failed to update card');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating card:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to update card');
      }
      throw error;
    }
  },

  deleteCard: async (cardId: string): Promise<void> => {
    try {
      await api.delete(API_ROUTES.CARDS.BY_ID(cardId));
    } catch (error) {
      console.error('Error deleting card:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        throw new Error(apiError?.error || 'Failed to delete card');
      }
      throw error;
    }
  },
};