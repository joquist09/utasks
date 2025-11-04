import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Board } from '../../types';
import { boardService } from '../../services/api/boards';
import CreateBoardDialog from './CreateBoardDialog';

const BoardsList: React.FC = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }
      const fetchedBoards = await boardService.getBoardsByUserId(userId);
      setBoards(fetchedBoards);
      setError(null);
    } catch (err) {
      setError('Failed to load boards. Please try again.');
      console.error('Error fetching boards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchBoards();
  }, []);

  const handleCreateBoard = async (name: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not logged in');
    }
    const newBoard = await boardService.createBoard({ name, userId });
    setBoards((prevBoards) => [...prevBoards, newBoard]);
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!window.confirm('Are you sure you want to delete this board?')) {
      return;
    }

    try {
      await boardService.deleteBoard(boardId);
      setBoards((prevBoards) => prevBoards.filter((board) => board.id !== boardId));
    } catch (err) {
      console.error('Error deleting board:', err);
      alert('Failed to delete board. Please try again.');
    }
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

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">My Boards</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Create Board
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {boards.map((board) => (
            <Card
              key={board.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
                <CardContent
                  onClick={() => {
                    void navigate(`/boards/${board.id}`);
                  }}
                  sx={{ flexGrow: 1 }}
                >
                  <Typography variant="h6" gutterBottom>
                    {board.name}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDeleteBoard(board.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>

      <CreateBoardDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateBoard}
      />
    </Container>
  );
};

export default BoardsList;