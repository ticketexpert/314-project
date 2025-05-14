import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';


export default function TrendingEvents({ title, subtitle = "Don't miss out on these popular events happening soon!", type = 'events', data = [] }) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (type === 'events') {
      navigate('/events');
    } else if (type === 'artists') {
      navigate('/locations ');
    }
  };
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1400,
        mx: 'auto',
        px: { xs: 1, sm: 3, md: 6, lg: 9 },
        py: { xs: 3, md: 6 },
        my: 4,
        background: '#f8fafc',
        borderRadius: 6,
        boxShadow: '0 2px 16px rgba(22,101,52,0.06)',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#9F1B32"
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ textAlign: { xs: 'center', md: 'left' }, mt: 1, mb: 2 }}
          >
            {subtitle}
          </Typography>
        </Box>
         <Button variant="outlined" sx={{ borderRadius: 99, fontWeight: 600, color: '#9F1B32', borderColor: '#9F1B32', display: { xs: 'none', md: 'inline-flex' } }} onClick={handleClick}>
          See All
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          pb: 2,
          maxWidth: '100%',
          mx: 'auto',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
            borderRadius: 4,
          },
        }}
      >
        {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'inline-block',
              minWidth: { xs: 220, sm: 260, md: 300 },
              maxWidth: 340,
              verticalAlign: 'top',
              background: '#fff',
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(22,101,52,0.08)',
              p: 1,
              transition: 'box-shadow 0.2s, transform 0.2s',
              '&:hover': {
                boxShadow: '0 6px 24px rgba(22,101,52,0.16)',
                transform: 'translateY(-4px) scale(1.03)',
              },
            }}
          >
            <EventCard {...item} type={type} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
