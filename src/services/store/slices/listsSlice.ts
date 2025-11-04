import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { List } from '../../../types';

interface ListsState {
  lists: Record<string, List[]>;
  loading: boolean;
  error: string | null;
}

const initialState: ListsState = {
  lists: {},
  loading: false,
  error: null,
};

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    fetchListsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchListsSuccess: (state, action: PayloadAction<{ boardId: string; lists: List[] }>) => {
      state.loading = false;
      state.lists[action.payload.boardId] = action.payload.lists;
    },
    fetchListsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addList: (state, action: PayloadAction<List>) => {
      const { boardId } = action.payload;
      if (!state.lists[boardId]) {
        state.lists[boardId] = [];
      }
      state.lists[boardId].push(action.payload);
    },
    updateList: (state, action: PayloadAction<List>) => {
      const { boardId } = action.payload;
      const index = state.lists[boardId]?.findIndex(list => list.id === action.payload.id);
      if (index !== undefined && index !== -1) {
        state.lists[boardId][index] = action.payload;
      }
    },
    deleteList: (state, action: PayloadAction<{ boardId: string; listId: string }>) => {
      const { boardId, listId } = action.payload;
      if (state.lists[boardId]) {
        state.lists[boardId] = state.lists[boardId].filter(list => list.id !== listId);
      }
    },
    reorderLists: (state, action: PayloadAction<{
      boardId: string;
      sourceIndex: number;
      destinationIndex: number;
    }>) => {
      const { boardId, sourceIndex, destinationIndex } = action.payload;
      const lists = state.lists[boardId];
      if (!lists) return;

      const [removed] = lists.splice(sourceIndex, 1);
      lists.splice(destinationIndex, 0, removed);
    },
  },
});

export const {
  fetchListsStart,
  fetchListsSuccess,
  fetchListsFailure,
  addList,
  updateList,
  deleteList,
  reorderLists,
} = listsSlice.actions;

export default listsSlice.reducer;