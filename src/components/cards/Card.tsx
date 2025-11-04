import React, { useState } from 'react';
import { Paper, Typography, Box, Chip, IconButton, Menu, MenuItem } from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';
import { Card as CardType } from '../../types';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { cardService } from '../../services/api/cards';
import EditCardDialog from './EditCardDialog';

interface CardProps {
  card: CardType;
  index: number;
  onDelete?: (cardId: string) => void;
  onUpdate?: (card: CardType) => void;
}

const priorityColors: Record<number, 'success' | 'warning' | 'error'> = {
  1: 'success',
  2: 'warning',
  3: 'error',
};

const priorityLabels: Record<number, string> = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
};

const priorityIcons: Record<number, string> = {
  1: '↓',
  2: '→',
  3: '↑',
};

const Card: React.FC<CardProps> = ({ card, index, onDelete, onUpdate }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardType>(card);
  React.useEffect(() => {
    setCurrentCard(card);
  }, [card]);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    setIsEditDialogOpen(true);
  };

  const handleSaveCard = async (updatedCard: CardType) => {
    try {
      await cardService.updateCard(updatedCard.id, {
        title: updatedCard.title,
        description: updatedCard.description,
        priority: updatedCard.priority,
        dueDate: updatedCard.dueDate,
        isCompleted: updatedCard.isCompleted,
        listId: updatedCard.listId,
      });
      setCurrentCard(updatedCard);
      onUpdate?.(updatedCard);
    } catch (error) {
      console.error('Error updating card:', error);
      alert(`Failed to update card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async () => {
    handleClose();
    if (!window.confirm('Are you sure you want to delete this card?')) {
      return;
    }

    try {
      await cardService.deleteCard(card.id);
      onDelete?.(card.id);
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card. Please try again.');
    }
  };

  const priority = currentCard.priority || 1;

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <Paper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{
            p: {
              xs: 2,
              sm: 1.5,
            },
            mb: 1,
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: 'grey.50',
            },
            position: 'relative',
            borderRadius: 1,
            boxShadow: 1,
            touchAction: 'none',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="body1" gutterBottom sx={{ pr: 4 }}>
              {currentCard.title}
            </Typography>
            <IconButton
              size="small"
              onClick={handleClick}
              sx={{ position: 'absolute', top: 4, right: 4 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>

          {currentCard.description && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {currentCard.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            <Chip
              icon={<PriorityHighIcon />}
              label={`${priorityIcons[priority]} ${priorityLabels[priority]}`}
              size="small"
              color={priorityColors[priority]}
            />
            {currentCard.dueDate && (
              <Chip
                icon={<AccessTimeIcon />}
                label={new Date(currentCard.dueDate).toLocaleDateString()}
                size="small"
                variant="outlined"
              />
            )}
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem onClick={handleEdit}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                void handleDelete();
              }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>

          <EditCardDialog
            open={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSave={(updatedCard) => {
              void handleSaveCard(updatedCard);
            }}
            card={currentCard}
          />
        </Paper>
      )}
    </Draggable>
  );
};

export default Card;