import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { CreateCardDto } from '../../types';

interface CreateCardDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCardDto) => Promise<void>;
  listId: string;
}

const priorityOptions = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
];

const CreateCardDialog: React.FC<CreateCardDialogProps> = ({ open, onClose, onSubmit, listId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setPriority(1);
      setDueDate('');
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle.length < 3) {
      alert('Card title must be at least 3 characters long');
      return;
    }

    if (trimmedTitle.length > 50) {
      alert('Card title must not exceed 50 characters');
      return;
    }

    if (!trimmedDescription) {
      alert('Card description is required');
      return;
    }

    if (trimmedDescription.length > 30) {
      alert('Card description must not exceed 30 characters');
      return;
    }

    if (!dueDate) {
      alert('Due date is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: trimmedTitle,
        description: trimmedDescription,
        listId,
        priority,
        dueDate: new Date(dueDate).toISOString(),
      });
      onClose();
    } catch (error) {
      console.error('Failed to create card:', error);
      alert(`Failed to create card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <DialogTitle>Create Card</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title (3-50 characters)"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
            required
            inputProps={{ maxLength: 50, minLength: 3 }}
            helperText={`${title.length}/50 characters`}
          />
          <TextField
            margin="dense"
            label="Description (max 30 characters)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            fullWidth
            required
            multiline
            rows={3}
            inputProps={{ maxLength: 30 }}
            helperText={`${description.length}/30 characters`}
          />
          <FormControl margin="dense" fullWidth>
            <InputLabel id="card-priority-label">Priority</InputLabel>
            <Select
              labelId="card-priority-label"
              value={priority}
              label="Priority"
              onChange={(event) => setPriority(Number(event.target.value))}
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Due date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCardDialog;
