import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function EventCard({ name, category, type = 'events', isLabel, label, eventId, region, image }) {
  // Determine the link path based on the card type
  const getLinkPath = () => {
    if (type === 'events') {
      return `/event/${eventId}`;
    } else if (type === 'artists') {
      return `/events?location=${encodeURIComponent(region)}`;
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
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
            borderRadius: 6,
            zIndex: 1
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
              zIndex: 2
            }}
          >
            {type === 'artists' ? category : label}
          </Box>
        )}

        {/* Bottom Content */}
        <Box sx={{ position: 'relative', zIndex: 2, color: 'white' }}>
          {type === 'events' ? (
            <>
              <Typography variant="body2" fontWeight={400} sx={{ opacity: 0.9 }}>
                {category.toUpperCase()}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                {name}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body2" fontWeight={400} sx={{ opacity: 0.9 }}>
                Events from
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                {name}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Link>
  );
}
