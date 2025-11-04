import React from 'react';
import { Box, Typography, Button, Container, IconButton } from '@mui/material';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import List from '../lists/List.tsx';
import { List as ListType, PendingCardMove } from '../../types';

interface BoardProps {
  title: string;
  lists: ListType[];
  onDragEnd: (result: DropResult) => void;
  onAddList: () => void;
  refreshKey?: number;
  pendingMove?: PendingCardMove | null;
  onDeleteList: (listId: string) => void;
}

const Board: React.FC<BoardProps> = ({ title, lists, onDragEnd, onAddList, refreshKey = 0, pendingMove = null, onDeleteList }) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth={false}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton 
            onClick={() => {
              void navigate('/boards');
            }}
            aria-label="back to boards"
            sx={{ color: 'primary.main' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            {title}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
            overflowX: {
              xs: 'visible',
              md: 'auto',
            },
            minHeight: 'calc(100vh - 200px)',
            gap: {
              xs: 2,
              md: 0,
            },
          }}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-lists" direction="horizontal" type="list">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ 
                    display: 'flex',
                    flexDirection: {
                      xs: 'column',
                      md: 'row',
                    },
                    alignItems: 'flex-start',
                    width: '100%',
                    gap: {
                      xs: 2,
                      md: 0,
                    },
                  }}
                >
                  {lists.map((list, index) => (
                    <List
                      key={list.id}
                      list={list}
                      index={index}
                      refreshTrigger={refreshKey}
                      pendingMove={pendingMove}
                      onDeleteList={onDeleteList}
                    />
                  ))}
                  {provided.placeholder}
                  <Button
                    variant="contained"
                    onClick={onAddList}
                    sx={{ 
                      minWidth: {
                        xs: '100%',
                        md: 275,
                      },
                      mx: {
                        xs: 0,
                        md: 1,
                      },
                      height: 'fit-content',
                    }}
                  >
                    Add List
                  </Button>
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Box>
    </Container>
  );
};

export default Board;