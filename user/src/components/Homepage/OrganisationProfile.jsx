import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Stack, Container, Paper, Grid, Divider } from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const colorScheme = {
  blue: {
    primary: '#034AA6',
    light: '#e6f0ff',
    hover: '#023b88'
  },
  yellow: {
    primary: '#f59e42',
    light: '#fff7ed',
    hover: '#d97706'
  },
  green: {
    primary: '#166534',
    light: '#e6f4ea',
    hover: '#14532d'
  },
  red: {
    primary: '#9F1B32',
    light: '#fbe9eb',
    hover: '#7f1628'
  }
};

export default function OrganisationProfile() {
  const { id } = useParams();
  const [organisation, setOrganisation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganisation = async () => {
      try {
        const response = await fetch(`https://api.ticketexpert.me/api/organisations/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch organisation');
        }
        const data = await response.json();
        setOrganisation(data);
      } catch (error) {
        console.error('Error fetching organisation:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisation();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Loading organisation profile...</Typography>
      </Container>
    );
  }

  if (error || !organisation) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Organisation Not Found</Typography>
        <Typography variant="body1" color="text.secondary">The organisation you are looking for does not exist.</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link underline="hover" color={colorScheme.blue.primary} href="/organisations" sx={{ fontWeight: 600 }}>
            Organisations
          </Link>
          <Typography color={colorScheme.blue.primary} fontWeight={600}>
            {organisation.name}
          </Typography>
        </Breadcrumbs>

        {/* Organisation Header */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 4, bgcolor: colorScheme.blue.light }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <GroupWorkIcon sx={{ color: colorScheme.blue.primary, fontSize: 32 }} />
                  <Typography variant="h4" fontWeight="bold" color={colorScheme.blue.primary}>
                    {organisation.name}
                  </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary">
                  {organisation.description}
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocationOnIcon sx={{ color: colorScheme.blue.primary }} />
                    <Typography variant="body1">{organisation.contact}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <EmailIcon sx={{ color: colorScheme.blue.primary }} />
                    <Typography variant="body1">{organisation.contact}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PhoneIcon sx={{ color: colorScheme.blue.primary }} />
                    <Typography variant="body1">{organisation.contact}</Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    component={RouterLink}
                    to={`/organisation/${organisation.eventOrgId}/events`}
                    sx={{ 
                      bgcolor: colorScheme.blue.primary,
                      borderRadius: 99,
                      fontWeight: 600,
                      px: 4,
                      '&:hover': { 
                        bgcolor: colorScheme.blue.hover,
                      }
                    }}
                  >
                    View Events
                  </Button>
                  <Button 
                    variant="outlined" 
                    sx={{ 
                      borderColor: colorScheme.blue.primary,
                      color: colorScheme.blue.primary,
                      borderRadius: 99,
                      fontWeight: 600,
                      px: 4,
                      '&:hover': { 
                        borderColor: colorScheme.blue.hover,
                        color: colorScheme.blue.hover,
                      }
                    }}
                  >
                    Contact
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Social Media Links */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" color={colorScheme.blue.primary} mb={3}>
            Connect With Us
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<FacebookIcon />}
              sx={{
                borderColor: colorScheme.blue.primary,
                color: colorScheme.blue.primary,
                '&:hover': {
                  borderColor: colorScheme.blue.hover,
                  color: colorScheme.blue.hover,
                }
              }}
            >
              Facebook
            </Button>
            <Button
              variant="outlined"
              startIcon={<TwitterIcon />}
              sx={{
                borderColor: colorScheme.blue.primary,
                color: colorScheme.blue.primary,
                '&:hover': {
                  borderColor: colorScheme.blue.hover,
                  color: colorScheme.blue.hover,
                }
              }}
            >
              Twitter
            </Button>
            <Button
              variant="outlined"
              startIcon={<InstagramIcon />}
              sx={{
                borderColor: colorScheme.blue.primary,
                color: colorScheme.blue.primary,
                '&:hover': {
                  borderColor: colorScheme.blue.hover,
                  color: colorScheme.blue.hover,
                }
              }}
            >
              Instagram
            </Button>
            <Button
              variant="outlined"
              startIcon={<LinkedInIcon />}
              sx={{
                borderColor: colorScheme.blue.primary,
                color: colorScheme.blue.primary,
                '&:hover': {
                  borderColor: colorScheme.blue.hover,
                  color: colorScheme.blue.hover,
                }
              }}
            >
              LinkedIn
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
} 