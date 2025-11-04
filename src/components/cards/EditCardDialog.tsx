import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { Card } from '../../types';

interface EditCardDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (card: Card) => void;
  card: Card | null;
}

type CardFormData = {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
};

const EditCardDialog: React.FC<EditCardDialogProps> = ({
  open,
  onClose,
  onSave,
  card,
}) => {
  const [formData, setFormData] = React.useState<CardFormData>({
    title: '',
    description: '',
    priority: 1,
    dueDate: '',
  });

  React.useEffect(() => {
    if (card) {
      setFormData({
        title: card.title,
        description: card.description || '',
        priority: card.priority || 1,
        dueDate: card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 1,
        dueDate: '',
      });
    }
  }, [card]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!card) return;
    
    const cardToSave: Card = {
      ...card,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      isCompleted: card.isCompleted,
    };
    onSave(cardToSave);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{card ? 'Edit Card' : 'Create Card'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="title"
              label="Title (3-50 characters)"
              value={formData.title}
              onChange={handleTextChange}
              fullWidth
              required
              inputProps={{ minLength: 3, maxLength: 50 }}
              helperText={`${formData.title.length}/50 characters`}
            />
            <TextField
              name="description"
              label="Description (max 30 characters)"
              value={formData.description}
              onChange={handleTextChange}
              fullWidth
              multiline
              rows={2}
              inputProps={{ maxLength: 30 }}
              required
              helperText={`${formData.description.length}/30 characters`}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleSelectChange}
                label="Priority"
              >
                <MenuItem value={1}>Low</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="dueDate"
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={handleTextChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCardDialog;