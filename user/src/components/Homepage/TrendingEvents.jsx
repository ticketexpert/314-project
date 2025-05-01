import React from 'react';
import { Box, Typography } from '@mui/material';
import EventCard from './EventCard';

export default function TrendingEvents({ title, type = 'events', data = [] }) {
  return (
    <Box sx={{ px: 9, py: 6 , alignItems: 'center',}}>
      <Typography variant="h4" fontWeight="bold" color="#9F1B32" mb={3}>
        {title}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          pb: 2,
          maxWidth: '100%',
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
          <Box key={index} sx={{ display: 'inline-block' }}>
            <EventCard {...item} type={type} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
