export const API_BASE_URL = 'https://utasks-026af75f15a3.herokuapp.com/api';

export const API_ROUTES = {
  AUTH: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    ME: '/users/me',
  },
  BOARDS: {
    BASE: '/boards',
    BY_ID: (id: string) => `/boards/${id}`,
    BY_USER_ID: (userId: string) => `/boards/user/${userId}`,
  },
  LISTS: {
    BASE: '/lists',
    ALL: (boardId: string) => `/lists/board/${boardId}`,
    BY_ID: (listId: string) => `/lists/${listId}`,
  },
  CARDS: {
    BASE: '/cards',
    ALL: (listId: string) => `/cards/list/${listId}`,
    BY_ID: (cardId: string) => `/cards/${cardId}`,
  },
};