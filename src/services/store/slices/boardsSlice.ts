import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board } from '../../../types';

interface BoardsState {
  boards: Board[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  loading: false,
  error: null,
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    fetchBoardsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBoardsSuccess: (state, action: PayloadAction<Board[]>) => {
      state.loading = false;
      state.boards = action.payload;
    },
    fetchBoardsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
    },
    updateBoard: (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex(board => board.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
    },
    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter(board => board.id !== action.payload);
    },
  },
});

export const {
  fetchBoardsStart,
  fetchBoardsSuccess,
  fetchBoardsFailure,
  addBoard,
  updateBoard,
  deleteBoard,
} = boardsSlice.actions;

export default boardsSlice.reducer;