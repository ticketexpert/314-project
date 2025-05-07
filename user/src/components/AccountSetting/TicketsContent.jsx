import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, Chip, Stack, Tooltip, Avatar } from "@mui/material";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { getTickets } from '../../data/tickets';

export default function TicketsContent() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  return (
    <Box width="100%">
      <Typography variant="h4" fontWeight="bold" mb={4} color="#166534">
        My Tickets
      </Typography>

      {tickets.length === 0 && (
        <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center', background: '#f8fafc', color: '#888' }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>No Tickets Found</Typography>
          <Typography fontSize="15px">You haven't purchased any tickets yet.</Typography>
        </Paper>
      )}

      {tickets.map((ticket) => (
        <Paper
          key={ticket.id}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: "24px",
            backgroundColor: "#ecfdf5",
            mb: 3,
            boxShadow: '0 2px 12px rgba(22,101,52,0.04)'
          }}
        >
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'start', md: 'center' }}>
            <Box flex={1} minWidth={0}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#166534' }}>
                {ticket.eventName}
              </Typography>
              <Typography fontSize="15px" color="gray" mt={0.5}>
                {ticket.eventDate} • {ticket.location}
              </Typography>

              <Stack direction="row" spacing={1} mt={2} mb={1}>
                <Chip icon={<ConfirmationNumberIcon />} label={`Order: ${ticket.orderId}`} size="small" sx={{ bgcolor: '#e0e7ef', color: '#166534' }} />
                <Chip icon={<EventSeatIcon />} label={ticket.seat} size="small" sx={{ bgcolor: '#e0e7ef', color: '#166534' }} />
                <Chip label={ticket.status} size="small" color={ticket.status === 'Active' ? 'success' : 'default'} />
              </Stack>

              <Typography fontSize="14px" color="text.secondary" mb={1}>
                <strong>Purchase Date:</strong> {ticket.purchaseDate}
              </Typography>

              <Box display="flex" gap={2} mt={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#166534",
                    borderRadius: "9999px",
                    fontWeight: 'bold',
                  }}
                >
                  Return
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#166534",
                    color: "#166534",
                    borderRadius: "9999px",
                    fontWeight: 'bold',
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={{ xs: 3, md: 0 }} ml={{ md: 4 }}>
              <Tooltip title="Show QR Code">
                <Avatar
                  variant="rounded"
                  src={ticket.qrCode}
                  alt="QR Code"
                  sx={{ width: 90, height: 90, bgcolor: '#fff', border: '1px solid #e0e0e0', mb: 1 }}
                >
                  <QrCode2Icon fontSize="large" color="action" />
                </Avatar>
              </Tooltip>
              <Typography fontSize="12px" color="gray">Scan at entry</Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
