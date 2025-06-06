import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Stack, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import { Link as RouterLink } from 'react-router-dom';

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'events', label: 'Number of Events' },
];

export default function CategoriesList() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api.ticketexpert.me/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const events = await response.json();
        
      const categoryMap = events.reduce((acc, event) => {
          if (!acc[event.category]) {
            acc[event.category] = {
              name: event.category,
              eventCount: 0,
              events: [],
              image: event.image
            };
          }
          acc[event.category].eventCount++;
          acc[event.category].events.push(event);
          return acc;
        }, {});

        setCategories(Object.values(categoryMap));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter(category =>
      category.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'events') {
      filtered = filtered.sort((a, b) => b.eventCount - a.eventCount);
    }
    return filtered;
  }, [search, sort, categories]);

  if (loading) {
    return (
      <Box sx={{ width: '100vw', maxWidth: 1200, mx: 'auto', my: 4, px: { xs: 1, md: 3 }, pt: '100px', textAlign: 'center' }}>
        <Typography variant="h6">Loading categories...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100vw', maxWidth: 1200, mx: 'auto', my: 4, px: { xs: 1, md: 3 }, pt: '100px' }}>
      <Typography variant="h4" fontWeight="bold" color="#9F1B32" mb={3}>
        Event Categories
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search categories..."
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
        {filteredCategories.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h6">No categories found.</Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredCategories.map(category => (
            <Grid item xs={12} key={category.name}>
              <Card sx={{width: { xs: '100%', sm: '80vw' }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: 4, boxShadow: '0 2px 8px rgba(22,101,52,0.08)', height: { sm: 180, xs: 'auto' } }}>
                <Box
                  component="img"
                  src={category.image}
                  alt={category.name}
                  sx={{ width: { xs: '100%', sm: 200 }, height: { xs: 180, sm: '100%' }, objectFit: 'cover', borderTopLeftRadius: 4, borderBottomLeftRadius: { sm: 4, xs: 0 }, borderTopRightRadius: { xs: 4, sm: 0 } }}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
                  <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                    <Chip 
                      icon={<EventIcon />}
                      label={`${category.eventCount} Events`} 
                      color="primary" 
                      size="small" 
                      sx={{ bgcolor: '#e0e7ff', color: '#034AA6', fontWeight: 600, minWidth: 110, maxWidth: 140 }} 
                    />
                  </Stack>
                  <Typography variant="h6" fontWeight="bold" sx={{ whiteSpace: 'normal', wordBreak: 'break-word', mb: 1 }}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Discover {category.eventCount} exciting {category.name.toLowerCase()} events
                  </Typography>
                  <Box sx={{ mt: 'auto', textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      size="small"
                      component={RouterLink}
                      to={`/events?category=${category.name}`}
                      sx={{ borderRadius: 99, fontWeight: 600, background: '#034AA6', color: 'white', '&:hover': { background: '#033b88' } }}
                    >
                      View Events
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
