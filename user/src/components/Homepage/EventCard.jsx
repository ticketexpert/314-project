import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function EventCard({ name, category, type = 'events', isLabel, label, eventId, region }) {
  // Determine the link path based on the card type
  const getLinkPath = () => {
    if (type === 'events') {
      return `/event/${eventId}`;
    } else if (type === 'artists') {
      return `/locations?region=${encodeURIComponent(region)}`;
    }
    return '#';
  };

  return (
    <Link 
      to={getLinkPath()}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
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
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }
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
    </Link>
  );
}
