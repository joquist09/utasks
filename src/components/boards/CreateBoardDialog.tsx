import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface CreateBoardDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string) => Promise<void>;
}

const CreateBoardDialog: React.FC<CreateBoardDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (title.trim().length < 3) {
      alert('Board title must be at least 3 characters long');
      return;
    }

    if (title.trim().length > 50) {
      alert('Board title must not exceed 50 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title);
      setTitle('');
      onClose();
    } catch (error) {
      console.error('Failed to create board:', error);
      alert('Failed to create board. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={(e) => {
        void handleSubmit(e);
      }}>
        <DialogTitle>Create New Board</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Board Title (3-50 characters)"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            inputProps={{ minLength: 3, maxLength: 50 }}
            helperText={`${title.length}/50 characters`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting || !title.trim()}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateBoardDialog;