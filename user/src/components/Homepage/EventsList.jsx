import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Stack, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from 'react-router-dom';

const getUniqueCategories = (events) => [
  'All',
  ...Array.from(new Set(events.map(e => e.type)))
];

const getUniqueLocations = (events) => [
  'All',
  ...Array.from(new Set(events.map(e => e.location)))
];

const sortOptions = [
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'date', label: 'Date' },
];

export default function EventsList() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [sort, setSort] = useState('title');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://www.api.ticketexpert.me/api/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = useMemo(() => getUniqueCategories(events), [events]);
  const locations = useMemo(() => getUniqueLocations(events), [events]);

  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event =>
      (category === 'All' || event.type === category) &&
      (location === 'All' || event.location === location) &&
      (event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === 'title') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'date') {
      filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return filtered;
  }, [search, category, location, sort, events]);

  if (loading) {
    return (
      <Box sx={{ width: '100vw', maxWidth: 1200, mx: 'auto', my: 4, px: { xs: 1, md: 3 }, pt: '100px', textAlign: 'center' }}>
        <Typography variant="h6">Loading events...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100vw', maxWidth: 1200, mx: 'auto', my: 4, px: { xs: 1, md: 3 }, pt: '100px' }}>
      <Typography variant="h4" fontWeight="bold" color="#9F1B32" mb={3}>
        All Events
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 220, flex: 2 }}
        />
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={location}
            label="Location"
            onChange={e => setLocation(e.target.value)}
          >
            {locations.map(loc => (
              <MenuItem key={loc} value={loc}>{loc}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sort}
            label="Sort By"
            onChange={e => setSort(e.target.value)}
          >
            {sortOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Grid container spacing={3}>
        {filteredEvents.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h6">No events found.</Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredEvents.map(event => (
            <Grid item xs={12} key={event.eventId}>
              <Card sx={{width: { xs: '100%', sm: '80vw' }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: 4, boxShadow: '0 2px 8px rgba(22,101,52,0.08)', height: { sm: 180, xs: 'auto' } }}>
                <Box
                  component="img"
                  src={`https://source.unsplash.com/random/400x300?${event.type}`}
                  alt={event.title}
                  sx={{ width: { xs: '100%', sm: 200 }, height: { xs: 180, sm: '100%' }, objectFit: 'cover', borderTopLeftRadius: 4, borderBottomLeftRadius: { sm: 4, xs: 0 }, borderTopRightRadius: { xs: 4, sm: 0 } }}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
                  <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                    <Chip label={event.type.toUpperCase()} color="success" size="small" sx={{ bgcolor: '#e6f4ea', color: '#166534', fontWeight: 600, minWidth: 110, maxWidth: 140 }} />
                    <Chip label={new Date(event.date).toLocaleDateString()} color="primary" size="small" sx={{ bgcolor: '#e0e7ff', color: '#034AA6', fontWeight: 600, minWidth: 110, maxWidth: 140 }} />
                    <Chip label={`Ticket from $${event.price}`} size="small" sx={{ bgcolor: '#fbe9eb', color: '#9F1B32', fontWeight: 500, minWidth: 110, maxWidth: 140 }} />
                    <Chip label={event.location} size="small" sx={{ bgcolor: '#f3e8ff', color: '#6b21a8', fontWeight: 500, minWidth: 110, maxWidth: 140 }} />
                  </Stack>
                  <Typography variant="h6" fontWeight="bold" sx={{ whiteSpace: 'normal', wordBreak: 'break-word', mb: 1 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {event.description.length > 90 ? event.description.slice(0, 90) + '...' : event.description}
                  </Typography>
                  <Box sx={{ mt: 'auto', textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      size="small"
                      component={RouterLink}
                      to={`/event/${event.eventId}`}
                      sx={{ borderRadius: 99, fontWeight: 600, background: '#034AA6', color: 'white', '&:hover': { background: '#033b88' } }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
} 