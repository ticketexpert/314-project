import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Divider, Stack, IconButton, Card, CardContent } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ShareIcon from '@mui/icons-material/Share';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

const shareIcons = {
  instagram: <InstagramIcon sx={{ color: '#e1306c' }} />,
  whatsapp: <WhatsAppIcon sx={{ color: '#25d366' }} />,
  facebook: <FacebookIcon sx={{ color: '#0084ff' }} />,
};

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`https://api.ticketexpert.me/api/events/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', my: 4, px: { xs: 1, md: 3 }, textAlign: 'center' }}>
        <Typography variant="h6">Loading event details...</Typography>
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', my: 4, px: { xs: 1, md: 3 }, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Event Not Found</Typography>
        <Typography variant="body1" color="text.secondary">The event you are looking for does not exist.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', my: 4, px: { xs: 1, md: 3 } }}>
      {/* Breadcrumb */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
        <Link underline="hover" color="#166534" href="/events" sx={{ fontWeight: 700 }}>
          Events
        </Link>
        <Typography color="#166534" fontWeight={700}>
          {event.category}
        </Typography>
      </Breadcrumbs>

      {/* Banner Image */}
      <Box
        component="img"
        src={event.image}
        alt={event.title}
        sx={{
          width: '100%',
          height: { xs: 220, md: 320 },
          objectFit: 'cover',
          borderRadius: 6,
          mb: 3,
        }}
      />

      {/* Category & Title */}
      <Typography variant="h3" fontWeight="bold" color="#9F1B32" mb={2}>
        {event.title}
      </Typography>

      {/* Find Ticket Button & Share */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={2} mb={2}>
        <Button variant="contained" sx={{ background: '#034AA6', borderRadius: 99, fontWeight: 700, px: 4, py: 1, fontSize: '1rem', boxShadow: '0 2px 8px rgba(3,58,166,0.10)', '&:hover': { background: '#033b88' } }}>
          Find Ticket
        </Button>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">Share with your friend</Typography>
          {event.eventShareLinks?.map((link, index) => (
            <IconButton key={index} href={link} size="small" target="_blank" rel="noopener" sx={{ p: 0.5 }}>
              <ShareIcon />
            </IconButton>
          ))}
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Info Sections */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        <Box flex={2}>
          {/* General Information */}
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <InfoOutlinedIcon color="success" />
            <Typography variant="subtitle1" fontWeight={600} color="#166534">General Information</Typography>
          </Stack>
          <Typography variant="body1" mb={3}>{event.description}</Typography>

          {/* Time and Location */}
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <AccessTimeIcon sx={{ color: '#f59e42' }} />
            <Typography variant="subtitle1" fontWeight={600} color="#f59e42">Time and Location</Typography>
          </Stack>
          <Typography variant="body1" mb={0.5}>
            {formatDate(event.fromDateTime)} - {formatDate(event.toDateTime)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.venue}, {event.region}
          </Typography>

          {/* Pricing */}
          <Stack direction="row" alignItems="center" spacing={1} mt={3} mb={1}>
            <AttachMoneyIcon sx={{ color: '#166534' }} />
            <Typography variant="subtitle1" fontWeight={600} color="#166534">Pricing</Typography>
          </Stack>
          {event.pricing.map((price, index) => (
            <React.Fragment key={index}>
              <Typography variant="body1" mb={0.5}>
                <b>{price.type}:</b> ${price.price.toFixed(2)}
              </Typography>
              {index < event.pricing.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
          <Typography variant="body2" color="text.secondary" mb={2}>
            <b>Refund Policy:</b> {event.refundPolicy}
          </Typography>
        </Box>

        {/* Organiser Card */}
        <Box flex={1}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <GroupWorkIcon sx={{ color: '#166534' }} />
            <Typography variant="subtitle1" fontWeight={600} color="#166534">Organiser</Typography>
          </Stack>
          <Card sx={{ background: '#f8fafc', borderRadius: 4, boxShadow: '0 2px 8px rgba(22,101,52,0.08)' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={0.5}>{event.organiser}</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>{event.orgDescription}</Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" size="small" href={`mailto:${event.orgContact}`} sx={{ borderRadius: 99, fontWeight: 600, color: '#166534', borderColor: '#166534' }}>Contact</Button>
                <Button variant="contained" size="small" sx={{ borderRadius: 99, fontWeight: 600, background: '#166534', color: 'white', '&:hover': { background: '#14532d' } }}>Follow</Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      {/* Tags */}
      <Box mt={4}>
        <Typography variant="subtitle1" fontWeight={600} color="#9F1B32" mb={1}>Tags</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {event.tags.map((tag, idx) => (
            <Chip key={idx} label={tag} sx={{ bgcolor: '#fbe9eb', color: '#9F1B32', fontWeight: 500, mb: 1 }} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
} 