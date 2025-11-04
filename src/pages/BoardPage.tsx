import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { DropResult } from '@hello-pangea/dnd';
import Board from '../components/boards/Board';
import CreateListDialog from '../components/lists/CreateListDialog';
import { List as ListType, PendingCardMove } from '../types';
import { boardService } from '../services/api/boards';
import { listService } from '../services/api/lists';
import { cardService } from '../services/api/cards';

const BoardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [boardName, setBoardName] = useState<string>('');
  const [lists, setLists] = useState<ListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingMove, setPendingMove] = useState<PendingCardMove | null>(null);
  const [isCreateListDialogOpen, setIsCreateListDialogOpen] = useState(false);
  const handleListDeleted = (listId: string) => {
    setLists((previous) => previous.filter((list) => list.id !== listId));
  };

  useEffect(() => {
    const fetchBoardData = async () => {
      if (!id) {
        setError('Board ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const board = await boardService.getBoard(id);
        setBoardName(board.name);

        const boardLists = await listService.getListsByBoardId(id);
        setLists(boardLists);
        setError(null);
      } catch (err) {
        console.error('Error fetching board data:', err);
        setError('Failed to load board. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void fetchBoardData();
  }, [id]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'list') {
      const reorderedLists = Array.from(lists);
      const [movedList] = reorderedLists.splice(source.index, 1);
      reorderedLists.splice(destination.index, 0, movedList);
      
      setLists(reorderedLists);
      return;
    }

    if (type === 'card') {
      const sourceListId = source.droppableId;
      const destListId = destination.droppableId;

      try {
        const moveBaseId = `${Date.now()}-${draggableId}`;

        if (sourceListId !== destListId) {
          setPendingMove({
            moveId: `${moveBaseId}-preview`,
            cardId: draggableId,
            sourceListId,
            destListId,
            destinationIndex: destination.index,
            isPreview: true,
          });
        }

        const card = await cardService.getCard(draggableId);

        setPendingMove({
          moveId: moveBaseId,
          cardId: draggableId,
          card,
          sourceListId,
          destListId,
          destinationIndex: destination.index,
        });
        
        if (sourceListId !== destListId) {
          await cardService.updateCard(draggableId, {
            title: card.title,
            description: card.description,
            priority: card.priority,
            dueDate: card.dueDate,
            isCompleted: card.isCompleted,
            listId: destListId,
          });
        }
        
        if (id) {
          setRefreshKey(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error moving card:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`Failed to move card: ${errorMessage}`);
        
        if (id) {
          const boardLists = await listService.getListsByBoardId(id);
          setLists(boardLists);
          setRefreshKey(prev => prev + 1);
        }
      } finally {
        setPendingMove(null);
      }
    }
  };

  const handleAddList = () => {
    setIsCreateListDialogOpen(true);
  };

  const handleCreateList = async (name: string): Promise<void> => {
    if (!id) {
      throw new Error('Board ID is missing');
    }

    const newList = await listService.createList({ name, boardId: id });
    setLists((previous) => [...previous, newList]);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ py: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Board 
        title={boardName} 
        lists={lists} 
        refreshKey={refreshKey}
        pendingMove={pendingMove}
        onDragEnd={(result) => {
          void handleDragEnd(result);
        }} 
        onAddList={handleAddList}
        onDeleteList={handleListDeleted}
      />
      <CreateListDialog
        open={isCreateListDialogOpen}
        onClose={() => setIsCreateListDialogOpen(false)}
        onSubmit={(name) => handleCreateList(name)}
      />
    </>
  );
};

export default BoardPage;
