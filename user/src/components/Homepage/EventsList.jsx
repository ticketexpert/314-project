import React, { useState, useMemo } from 'react';
import { Box, Typography, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Stack, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import eventSamples from '../../data/eventSample';
import { Link as RouterLink } from 'react-router-dom';

const getUniqueCategories = (events) => [
  'All',
  ...Array.from(new Set(events.map(e => e.category)))
];

const sortOptions = [
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'date', label: 'Date' },
];

export default function EventsList() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('title');

  const categories = useMemo(() => getUniqueCategories(eventSamples), []);

  const filteredEvents = useMemo(() => {
    let filtered = eventSamples.filter(event =>
      (category === 'All' || event.category === category) &&
      (event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === 'title') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'date') {
      filtered = filtered.sort((a, b) => new Date(a.dateRange.split(' ')[0]) - new Date(b.dateRange.split(' ')[0]));
    }
    return filtered;
  }, [search, category, sort]);

  return (
    <Box sx={{ width: '100vw', maxWidth: 1200, mx: 'auto', my: 4, px: { xs: 1, md: 3 } }}>
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
            <Grid item xs={12} key={event.id}>
              <Card sx={{width: '1000px', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: 4, boxShadow: '0 2px 8px rgba(22,101,52,0.08)', height: { sm: 180, xs: 'auto' } }}>
                <Box
                  component="img"
                  src={event.image}
                  alt={event.title}
                  sx={{ width: { xs: '100%', sm: 180 }, height: { xs: 180, sm: '100%' }, objectFit: 'cover', borderTopLeftRadius: 4, borderBottomLeftRadius: { sm: 4, xs: 0 }, borderTopRightRadius: { xs: 4, sm: 0 } }}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
                  <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                    <Chip label={event.category} color="success" size="small" sx={{ bgcolor: '#e6f4ea', color: '#166534', fontWeight: 600, minWidth: 110, maxWidth: 140 }} />
                    <Chip label={event.dateRange} color="primary" size="small" sx={{ bgcolor: '#e0e7ff', color: '#034AA6', fontWeight: 600, minWidth: 110, maxWidth: 140 }} />
                    {event.tags && event.tags.slice(0, 3).map((tag, idx) => (
                      <Chip key={idx} label={tag} size="small" sx={{ bgcolor: '#fbe9eb', color: '#9F1B32', fontWeight: 500, minWidth: 110, maxWidth: 140 }} />
                    ))}
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
                      to={`/event/${event.id}`}
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