import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";

const tickets = [
  {
    eventName: "Kiama Jazz and Blues Festival",
    eventDate: "7-9 March 2025",
    location: "Kiama, Gerringong & Minnamurra",
    purchaseDate: "Jul 20 2025",
    orderId: "A012123",
    seat: "Row 3 Seat 1A",
    status: "Active",
  },
  {
    eventName: "Kiama Jazz and Blues Festival",
    eventDate: "7-9 March 2025",
    location: "Kiama, Gerringong & Minnamurra",
    purchaseDate: "Jul 20 2025",
    orderId: "A012123",
    seat: "Row 3 Seat 1A",
    status: "Active",
  },
];

export default function TicketsContent() {
  return (
    <Box width="100%">
      <Typography variant="h4" fontWeight="bold" mb={4} color="#166534">
        My Tickets
      </Typography>

      {tickets.map((ticket, index) => (
        <Paper
          key={index}
          sx={{
            p: 3,
            borderRadius: "24px",
            backgroundColor: "#ecfdf5",
            mb: 3,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="start">
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {ticket.eventName}
              </Typography>
              <Typography fontSize="14px" color="gray" mt={0.5}>
                {ticket.eventDate} • {ticket.location}
              </Typography>

              <Typography mt={2} fontSize="14px"><strong>Purchase Date:</strong> {ticket.purchaseDate}</Typography>
              <Typography fontSize="14px"><strong>Order ID:</strong> {ticket.orderId}</Typography>
              <Typography fontSize="14px"><strong>Seat:</strong> {ticket.seat}</Typography>
              <Typography fontSize="14px"><strong>Status:</strong> {ticket.status}</Typography>

              <Box display="flex" gap={2} mt={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#166534",
                    borderRadius: "9999px",
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
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
