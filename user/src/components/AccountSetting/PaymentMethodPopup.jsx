import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#166534',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#166534',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#166534',
  },
};

export default function PaymentMethodPopup({ open, onClose, card, onUpdate, onDelete, mode = 'view' }) {
  const [formData, setFormData] = useState({
    cardNumber: card?.cardNumber || '',
    cardHolder: card?.cardHolder || '',
    expiryDate: card?.expiryDate || '',
    cvv: card?.cvv || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'edit') {
      onUpdate({ ...card, ...formData });
    } else if (mode === 'add') {
      onUpdate(formData);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {mode === 'view' ? 'Card Details' : mode === 'edit' ? 'Edit Card' : 'Add New Card'}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {mode === 'view' ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Card Number: {card?.cardNumber}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Card Holder: {card?.cardHolder}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Expiry Date: {card?.expiryDate}
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Card Number"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              sx={textFieldStyles}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Card Holder Name"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleChange}
              sx={textFieldStyles}
              margin="normal"
            />
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Expiry Date (MM/YY)"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                sx={textFieldStyles}
                margin="normal"
              />
              <TextField
                fullWidth
                label="CVV"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                sx={textFieldStyles}
                margin="normal"
                type="password"
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {mode === 'view' ? (
          <>
            <Button onClick={() => onUpdate(card, 'edit')} sx={{ color: '#166534' }}>
              Edit
            </Button>
            <Button onClick={onDelete} sx={{ color: 'error.main' }} startIcon={<DeleteIcon />}>
              Delete
            </Button>
          </>
        ) : (
          <Button onClick={handleSubmit} sx={{ backgroundColor: '#166534', color: 'white' }}>
            {mode === 'edit' ? 'Update' : 'Add Card'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
} 