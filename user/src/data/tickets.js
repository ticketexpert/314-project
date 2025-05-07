// Sample tickets data
export const initialTickets = [
  {
    id: 1,
    eventName: "Kiama Jazz and Blues Festival",
    eventDate: "7-9 March 2025",
    location: "Kiama, Gerringong & Minnamurra",
    purchaseDate: "Jul 20 2025",
    orderId: "A012123",
    seat: "Row 3 Seat 1A",
    status: "Active",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=A012123"
  },
  {
    id: 2,
    eventName: "Sydney Comedy Gala Night",
    eventDate: "15 April 2025",
    location: "Sydney Opera House, Sydney",
    purchaseDate: "Feb 10 2025",
    orderId: "B045678",
    seat: "Row 1 Seat 5C",
    status: "Active",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=B045678"
  }
];

export const getTickets = () => {
  const stored = localStorage.getItem('tickets');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('tickets', JSON.stringify(initialTickets));
  return initialTickets;
};

export const addTicket = (ticket) => {
  const tickets = getTickets();
  const newTicket = { ...ticket, id: tickets.length ? Math.max(...tickets.map(t => t.id)) + 1 : 1 };
  const updated = [...tickets, newTicket];
  localStorage.setItem('tickets', JSON.stringify(updated));
  return newTicket;
};

export const updateTicket = (ticket) => {
  const tickets = getTickets();
  const updated = tickets.map(t => t.id === ticket.id ? ticket : t);
  localStorage.setItem('tickets', JSON.stringify(updated));
  return ticket;
};

export const deleteTicket = (id) => {
  const tickets = getTickets();
  const updated = tickets.filter(t => t.id !== id);
  localStorage.setItem('tickets', JSON.stringify(updated));
  return true;
}; 