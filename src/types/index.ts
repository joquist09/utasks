export interface User {
  id: string;
  username: string;
}

export interface AuthResponse {
  user: User;
}

export interface LoginCredentials {
  username: string;
}

export interface RegisterCredentials {
  username: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  userId: string;
}

export interface CreateBoardDto {
  name: string;
  description?: string;
  userId: string;
}

export interface UpdateBoardDto {
  name?: string;
  description?: string;
}

export interface List {
  id: string;
  boardId: string;
  name: string;
}

export interface CreateListDto {
  name: string;
  boardId: string;
}

export interface UpdateListDto {
  name?: string;
  boardId?: string;
}

export interface Card {
  id: string;
  listId: string;
  title: string;
  description?: string;
  priority: number;
  dueDate?: string;
  isCompleted: boolean;
}

export interface PendingCardMove {
  moveId: string;
  cardId: string;
  card?: Card;
  sourceListId: string;
  destListId: string;
  destinationIndex: number;
  isPreview?: boolean;
}

export interface CreateCardDto {
  title: string;
  description?: string;
  listId: string;
  priority?: number;
  dueDate?: string;
}

export interface UpdateCardDto {
  title?: string;
  description?: string;
  priority?: number;
  listId?: string;
  dueDate?: string;
  isCompleted?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface DragResult {
  destination?: {
    droppableId: string;
    index: number;
  };
  source: {
    droppableId: string;
    index: number;
  };
  draggableId: string;
  type: string;
}

export interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  board: BoardState;
}