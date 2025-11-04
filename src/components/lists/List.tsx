import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Paper, Typography, Box, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '../cards/Card.tsx';
import { List as ListType, Card as CardType, PendingCardMove } from '../../types';
import { cardService } from '../../services/api/cards';
import { listService } from '../../services/api/lists';

interface ListProps {
  list: ListType;
  index: number;
  refreshTrigger?: number;
  pendingMove?: PendingCardMove | null;
}

type SortOption = 'none' | 'priority-asc' | 'priority-desc' | 'date-asc' | 'date-desc';

const List: React.FC<ListProps> = ({ list, index, refreshTrigger = 0, pendingMove = null }) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const lastProcessedMoveId = useRef<string | null>(null);

  const sortedCards = useMemo(() => {
    const cardsCopy = [...cards];
    
    switch (sortBy) {
      case 'priority-asc':
        return cardsCopy.sort((a, b) => (a.priority || 1) - (b.priority || 1));
      case 'priority-desc':
        return cardsCopy.sort((a, b) => (b.priority || 1) - (a.priority || 1));
      case 'date-asc':
        return cardsCopy.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      case 'date-desc':
        return cardsCopy.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        });
      default:
        return cardsCopy;
    }
  }, [cards, sortBy]);

  useEffect(() => {
    if (!pendingMove) {
      return;
    }

    if (lastProcessedMoveId.current === pendingMove.moveId) {
      return;
    }

    const isSourceList = pendingMove.sourceListId === list.id;
    const isDestinationList = pendingMove.destListId === list.id;

    if (!isSourceList && !isDestinationList) {
      return;
    }

    setCards((prevCards) => {
      const updatedCards = [...prevCards];

      if (isSourceList) {
        const currentIndex = updatedCards.findIndex((card) => card.id === pendingMove.cardId);
        if (currentIndex === -1) {
          return updatedCards;
        }

        const [removedCard] = updatedCards.splice(currentIndex, 1);

        if (isDestinationList) {
          const insertIndex = Math.max(0, Math.min(pendingMove.destinationIndex, updatedCards.length));
          const cardToInsert = {
            ...removedCard,
            ...(pendingMove.card || removedCard),
            listId: pendingMove.destListId,
          };
          updatedCards.splice(insertIndex, 0, cardToInsert);
        }

        return updatedCards;
      }

      if (isDestinationList) {
        if (pendingMove.isPreview) {
          return updatedCards;
        }

        const exists = updatedCards.some((card) => card.id === pendingMove.cardId);
        if (exists) {
          return updatedCards;
        }

        const insertIndex = Math.max(0, Math.min(pendingMove.destinationIndex, updatedCards.length));
        const cardToInsert = {
          ...(pendingMove.card || {
            id: pendingMove.cardId,
            listId: pendingMove.destListId,
            title: '',
            description: '',
            priority: 1,
            dueDate: undefined,
            isCompleted: false,
          }),
          listId: pendingMove.destListId,
        };
        updatedCards.splice(insertIndex, 0, cardToInsert);
        return updatedCards;
      }

      return updatedCards;
    });

    lastProcessedMoveId.current = pendingMove.moveId;
  }, [pendingMove, list.id]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const fetchedCards = await cardService.getCardsByListId(list.id);
        setCards(fetchedCards);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchCards();
  }, [list.id, refreshTrigger]);

  const handleDeleteList = async () => {
    if (!window.confirm('Are you sure you want to delete this list?')) {
      return;
    }

    try {
      await listService.deleteList(list.id);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting list:', error);
      alert('Failed to delete list. Please try again.');
    }
  };

  const handleAddCard = async () => {
    const cardTitle = prompt('Enter card title (3-50 characters):');
    if (!cardTitle?.trim()) return;

    if (cardTitle.trim().length < 3) {
      alert('Card title must be at least 3 characters long');
      return;
    }

    if (cardTitle.trim().length > 50) {
      alert('Card title must not exceed 50 characters');
      return;
    }

    try {
      const newCard = await cardService.createCard({
        title: cardTitle,
        listId: list.id,
      });
      setCards((prevCards) => [...prevCards, newCard]);
    } catch (error) {
      console.error('Error creating card:', error);
      alert(`Failed to create card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <Paper
          {...provided.draggableProps}
          ref={provided.innerRef}
          sx={{
            width: {
              xs: '100%',
              md: '280px',
            },
            minWidth: {
              xs: '100%',
              md: '280px',
            },
            mx: {
              xs: 0,
              md: 1,
            },
            bgcolor: 'grey.100',
            maxHeight: {
              xs: '400px',
              md: 'calc(100vh - 240px)',
            },
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <Box
            sx={{
              bgcolor: 'grey.200',
            }}
          >
            <Box
              {...provided.dragHandleProps}
              sx={{
                p: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6">{list.name}</Typography>
              <IconButton
                size="small"
                onClick={() => {
                  void handleDeleteList();
                }}
                aria-label="delete list"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ px: 1, pb: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel id={`sort-label-${list.id}`}>Sort by</InputLabel>
                <Select
                  labelId={`sort-label-${list.id}`}
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="priority-asc">Priority (Low to High)</MenuItem>
                  <MenuItem value="priority-desc">Priority (High to Low)</MenuItem>
                  <MenuItem value="date-asc">Due Date (Earliest First)</MenuItem>
                  <MenuItem value="date-desc">Due Date (Latest First)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Droppable droppableId={list.id} type="card">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  p: 1,
                  flexGrow: 1,
                  overflowY: 'auto',
                }}
              >
                {loading ? (
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                ) : (
                  sortedCards.map((card, cardIndex) => (
                    <Card key={card.id} card={card} index={cardIndex} />
                  ))
                )}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>

          <Box sx={{ p: 1 }}>
            <Typography
              variant="body2"
              sx={{
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' },
              }}
              onClick={() => {
                void handleAddCard();
              }}
            >
              + Add a card
            </Typography>
          </Box>
        </Paper>
      )}
    </Draggable>
  );
};

export default List;