import React from 'react';
import { Box, Typography } from '@mui/material';

export default function EventCard({ name, category, type = 'events', isLabel, label }) {
  return (
    <Box
      sx={{
        minWidth: 220,
        height: 360,
        backgroundColor: '#ddd',
        borderRadius: 6,
        padding: 2,
        position: 'relative',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {(isLabel || type === 'artists') && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontSize: 12,
            fontWeight: 500,
            color: '#9F1B32',
          }}
        >
          {type === 'artists' ? category : label}
        </Box>
      )}

      {/* Bottom Content */}
      {type === 'events' ? (
        <>
          <Typography variant="body2" fontWeight={400}>
            {category.toUpperCase()}
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
            {name}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="body2" fontWeight={400}>
            Events from
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
            {name}
          </Typography>
        </>
      )}
    </Box>
  );
}
