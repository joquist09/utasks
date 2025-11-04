import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface CreateListDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

const CreateListDialog: React.FC<CreateListDialogProps> = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setName('');
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    if (trimmedName.length < 3) {
      alert('List name must be at least 3 characters long');
      return;
    }

    if (trimmedName.length > 30) {
      alert('List name must not exceed 30 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(trimmedName);
      onClose();
    } catch (error) {
      console.error('Failed to create list:', error);
      alert(`Failed to create list: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <DialogTitle>Create List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="List name (3-30 characters)"
            value={name}
            onChange={(event) => setName(event.target.value)}
            helperText={`${name.length}/30 characters`}
            inputProps={{ maxLength: 30 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !name.trim()}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateListDialog;
