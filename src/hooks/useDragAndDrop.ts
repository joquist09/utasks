import { useDispatch } from 'react-redux';
import { DropResult } from '@hello-pangea/dnd';
import { moveCard } from '../services/store/slices/cardsSlice';
import { reorderLists } from '../services/store/slices/listsSlice';

export const useDragAndDrop = (boardId: string) => {
  const dispatch = useDispatch();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'list') {
      dispatch(reorderLists({
        boardId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      }));
      return;
    }

    if (type === 'card') {
      dispatch(moveCard({
        cardId: draggableId,
        sourceListId: source.droppableId,
        targetListId: destination.droppableId,
        newPosition: destination.index,
      }));
    }
  };

  return { handleDragEnd };
};