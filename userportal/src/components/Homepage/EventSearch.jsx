import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  InputBase,
  Typography,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function EventSearch() {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'sans-serif',
      width: '100vw',
      padding: 4, 
      boxSizing: 'border-box', 
      justifyContent: 'center',
    }}>
      <Card
        sx={{
          width: '30vw',
          borderRadius: '50px',
          padding: 3,
          backgroundColor: '#0339A6',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: 350,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Search an event
        </Typography>
        <InputBase
          placeholder="Enter your place here"
          sx={{
            bgcolor: 'white',
            borderRadius: 5,
            px: 2,
            py: 1,
            color: '#0033a0',
          }}
        />
        <InputBase
          placeholder="Date"
          sx={{
            bgcolor: 'white',
            borderRadius: 5,
            px: 2,
            py: 1,
            color: '#0033a0',
          }}
        />
        <InputBase
          placeholder="Find an artist, event name or venue"
          sx={{
            bgcolor: 'white',
            borderRadius: 5,
            px: 2,
            py: 1,
            color: '#0033a0',
          }}
        />
        <Button
            variant="contained"
            sx={{
              alignSelf: 'flex-end',
              borderRadius: '33.5px',
              backgroundColor: '#034AA6',
              px: 4,
              '&:hover': {
                backgroundColor: '#033b88', // optional darker hover
              },
            }}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
      </Card>

      {/* Event Card */}
      <Card
        sx={{
          position: 'relative',
          width: '60vw',
          height: 350,
          borderRadius: 6,
          overflow: 'hidden',
          borderRadius: '60px',
        }}
      >
        
        <Box
          component="img"
          src="https://content.api.news/v3/images/bin/646402e6eb12d917fbf41a42737b95d3"
          alt="Illawarra Hawks"
          sx={{
            borderRadius: '60px',
            width: '70vw',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            color: 'white',
            p: 3,
            borderRadius: '60px 60px 60px 32px',
            background: 'linear-gradient(90deg, #02735E 0.17%, rgba(255, 255, 255, 0.00) 51.91%)',
            boxShadow: 'inset 0px 4px 4px 0px rgba(255, 255, 255, 0.25)',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" fontWeight="bold">
              27
            </Typography>
            <Typography variant="subtitle1">MAR</Typography>
          </Stack>
          <Typography variant="h6" fontWeight="bold">
            Illawarra Hawks Celebrate with the City
          </Typography>
          <Typography variant="body2">
            Crown Street Mall, Wollongong
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
