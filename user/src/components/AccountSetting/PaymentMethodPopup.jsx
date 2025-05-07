import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  Stack,
  Alert
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { validateCardNumber, getCardType, formatCardNumber } from '../../data/cards';

const PaymentMethodPopup = ({ open, onClose, card, onUpdate, onDelete, mode }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [cardType, setCardType] = useState('unknown');

  // Update form data when card prop changes
  useEffect(() => {
    if (card) {
      setFormData({
        cardNumber: card.cardNumber || '',
        cardHolder: card.cardHolder || '',
        expiryDate: card.expiryDate || '',
        cvv: card.cvv || ''
      });
      setCardType(getCardType(card.cardNumber || ''));
    } else {
      setFormData({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
      });
      setCardType('unknown');
    }
    setIsEditing(false);
    setErrors({});
  }, [card]);

  const validateForm = () => {
    const newErrors = {};
    
    // Card number validation
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Cardholder name validation
    if (!formData.cardHolder) {
      newErrors.cardHolder = 'Cardholder name is required';
    }

    // Expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardType(getCardType(formattedValue));
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .substring(0, 5);
    }
    // Format CVV
    else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const cardData = {
        ...formData,
        cardType,
        id: card?.id
      };
      onUpdate(cardData, mode);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    onDelete(card);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false);
      // Reset form data to original card data
      setFormData({
        cardNumber: card.cardNumber || '',
        cardHolder: card.cardHolder || '',
        expiryDate: card.expiryDate || '',
        cvv: card.cvv || ''
      });
      setErrors({});
    } else {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        pb: 2
      }}>
        <Typography variant="h6" color="#166534">
          {mode === 'add' ? 'Add New Card' : isEditing ? 'Edit Card' : 'Card Details'}
        </Typography>
        <IconButton onClick={handleCancel} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {mode === 'view' && !isEditing ? (
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Card Type</Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{cardType}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Card Number</Typography>
              <Typography variant="body1">{formatCardNumber(formData.cardNumber)}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Cardholder Name</Typography>
              <Typography variant="body1">{formData.cardHolder}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Expiry Date</Typography>
              <Typography variant="body1">{formData.expiryDate}</Typography>
            </Box>
          </Stack>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Card Number"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              fullWidth
              inputProps={{ maxLength: 19 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#166534' },
                  '&.Mui-focused fieldset': { borderColor: '#166534' },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#166534',
                },
              }}
            />
            <TextField
              label="Cardholder Name"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleChange}
              error={!!errors.cardHolder}
              helperText={errors.cardHolder}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#166534' },
                  '&.Mui-focused fieldset': { borderColor: '#166534' },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#166534',
                },
              }}
            />
            <Box display="flex" gap={2}>
              <TextField
                label="Expiry Date (MM/YY)"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                error={!!errors.expiryDate}
                helperText={errors.expiryDate}
                fullWidth
                inputProps={{ maxLength: 5 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#166534' },
                    '&.Mui-focused fieldset': { borderColor: '#166534' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#166534',
                  },
                }}
              />
              <TextField
                label="CVV"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                error={!!errors.cvv}
                helperText={errors.cvv}
                fullWidth
                type="password"
                inputProps={{ maxLength: 4 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#166534' },
                    '&.Mui-focused fieldset': { borderColor: '#166534' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#166534',
                  },
                }}
              />
            </Box>
            {cardType !== 'unknown' && (
              <Alert severity="info" sx={{ mt: 1 }}>
                Detected card type: {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        {mode === 'view' && !isEditing ? (
          <>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ mr: 'auto' }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ backgroundColor: '#166534', '&:hover': { backgroundColor: '#0f4c2c' } }}
            >
              Edit
            </Button>
          </>
        ) : (
          <>
            {mode !== 'add' && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{ mr: 'auto' }}
              >
                Delete
              </Button>
            )}
            <Button onClick={handleCancel} sx={{ color: '#666' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ backgroundColor: '#166534', '&:hover': { backgroundColor: '#0f4c2c' } }}
            >
              {mode === 'add' ? 'Add Card' : 'Save Changes'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentMethodPopup;
