# 🎟️ TicketExpert - Event Management Platform

TicketExpert is a modern, full-stack web application for managing events, users, and ticketing operations. The platform supports seamless coordination between event organisers and attendees through dedicated interfaces and backend integration.

## 📁 Project Structure

.
├── .github/workflows # CI/CD workflows
├── backend # Express.js backend with APIs for events, users, tickets
├── entryUser/entryuser # Entry user portal
├── organiser # Organiser dashboard for managing events and ticketing
├── user # Frontend for general users (attendees)
├── node_modules # Dependencies
├── .gitignore # Git ignore file
├── package.json # Project metadata and scripts
├── package-lock.json # Exact dependency versions
└── README.md # Project documentation


## 🚀 Features

- 🎫 **Ticket Booking** – Secure and fast ticket reservation system
- 📅 **Event Management** – Create, update, and publish events
- 📥 **User Roles** – Distinct interfaces for organisers, entry personnel, and users
- 📊 **Dashboard & Analytics** – Track ticket sales and attendance
- 📲 **Mobile-Friendly UI** – React-based frontends designed for responsiveness
- 🔐 **Authentication & Authorization** – Role-based access control
- ⚙️ **CI/CD Pipeline** – GitHub Actions integrated

## 🛠️ Tech Stack

- **Frontend**: React + MUI (Material UI)
- **Backend**: Node.js + Express.js + Sequelize ORM
- **Database**: PostgreSQL
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel / Render / AWS (depending on environment)

## 📦 Installation
# Clone the repo
git clone https://github.com/ticketexpert/314-project.git
cd 314-project

# Install dependencies (root-level)
npm install

# Navigate to each folder (backend, user, organiser) and install dependencies
cd backend && npm install
cd ../user && npm install
cd ../organiser && npm install
🚧 Running the App
# Run backend
cd backend
npm run dev

# Run user portal
cd user
npm run dev

# Run organiser portal
cd organiser
npm run dev

# Run ticket scanner
cd entryUser
cd entryuser
npm run dev
🧪 Running Tests
Tests can be configured per module. CI pipelines are defined in .github/workflows.

📄 License
MIT License. See LICENSE file for details.

## 👥 Contributors

- [@BergaDev](https://github.com/BergaDev) – Matthew Bergamini  
- [@khiemhuu](https://github.com/khiemhuu) – Huu Khiem Nguyen  
- [@Abby010](https://github.com/Abby010) – Abhishek Mehta
