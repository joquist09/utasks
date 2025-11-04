import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Card } from '../../../types';

interface CardsState {
  cards: Record<string, Card[]>;
  loading: boolean;
  error: string | null;
}

const initialState: CardsState = {
  cards: {},
  loading: false,
  error: null,
};

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    fetchCardsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCardsSuccess: (state, action: PayloadAction<{ listId: string; cards: Card[] }>) => {
      state.loading = false;
      state.cards[action.payload.listId] = action.payload.cards;
    },
    fetchCardsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addCard: (state, action: PayloadAction<Card>) => {
      const { listId } = action.payload;
      if (!state.cards[listId]) {
        state.cards[listId] = [];
      }
      state.cards[listId].push(action.payload);
    },
    updateCard: (state, action: PayloadAction<Card>) => {
      const { listId } = action.payload;
      const index = state.cards[listId]?.findIndex(card => card.id === action.payload.id);
      if (index !== undefined && index !== -1) {
        state.cards[listId][index] = action.payload;
      }
    },
    deleteCard: (state, action: PayloadAction<{ listId: string; cardId: string }>) => {
      const { listId, cardId } = action.payload;
      if (state.cards[listId]) {
        state.cards[listId] = state.cards[listId].filter(card => card.id !== cardId);
      }
    },
    moveCard: (state, action: PayloadAction<{
      cardId: string;
      sourceListId: string;
      targetListId: string;
      newPosition: number;
    }>) => {
      const { cardId, sourceListId, targetListId, newPosition } = action.payload;
      
      const sourceCards = state.cards[sourceListId] || [];
      const card = sourceCards.find(c => c.id === cardId);
      if (!card) return;
      
      state.cards[sourceListId] = sourceCards.filter(c => c.id !== cardId);
      
      if (!state.cards[targetListId]) {
        state.cards[targetListId] = [];
      }
      
      const updatedCard = { ...card, listId: targetListId };
      state.cards[targetListId] = [
        ...state.cards[targetListId].slice(0, newPosition),
        updatedCard,
        ...state.cards[targetListId].slice(newPosition)
      ];
    },
  },
});

export const {
  fetchCardsStart,
  fetchCardsSuccess,
  fetchCardsFailure,
  addCard,
  updateCard,
  deleteCard,
  moveCard,
} = cardsSlice.actions;

export default cardsSlice.reducer;