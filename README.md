
# 🎟️ TicketExpert - Your All-in-One Event Management Platform

TicketExpert is a modern, full-stack web application designed to streamline event management and ticketing. Our platform provides dedicated portals for event organizers, entry personnel, and attendees, all powered by a robust backend.

## 📂 Project Structure

```
.
├── .github/workflows       # CI/CD automation workflows
├── backend                 # Express.js API for events, users, and tickets
├── entryUser/entryuser     # Portal for ticket validation at events
├── organiser               # Dashboard for event creation and ticket management
├── user                    # Attendee interface for browsing and booking tickets
├── node_modules            # Project dependencies
├── .gitignore              # Specifies intentionally untracked files that Git should ignore
├── package.json            # Project metadata and script commands
├── package-lock.json       # Records the exact versions of dependencies
└── README.md               # Project documentation (this file)
```

## ✨ Key Features

- **🎫 Effortless Ticket Booking:** A secure and intuitive system for reserving event tickets.
- **📅 Simplified Event Management:** Tools for organizers to easily create, update, and publish event details.
- **👤 Dedicated User Roles:** Tailored interfaces for organizers, entry staff, and event attendees.
- **📊 Insightful Dashboards & Analytics:** Track ticket sales and monitor attendance in real-time.
- **📱 Responsive Design:** User-friendly React frontends that adapt seamlessly to any device.
- **🔒 Robust Authentication & Authorization:** Secure, role-based access control to protect your data.
- **⚙️ Automated CI/CD:** Integrated GitHub Actions for continuous integration and deployment.

## 🛠️ Under the Hood

- **Frontend:** React, styled with the elegant Material UI (MUI) library.
- **Backend:** Powered by Node.js and Express.js, leveraging Sequelize ORM for database interactions.
- **Database:** Reliable data storage with PostgreSQL.
- **CI/CD:** Automated using GitHub Actions for seamless development and deployment.
- **Deployment:** Flexible deployment options supporting Vercel, Render, and AWS.

## 🚀 Get Started

```bash
# Clone the repository
git clone https://github.com/ticketexpert/314-project.git
cd 314-project

# Install root-level dependencies
npm install

# Install dependencies for each module
cd backend
npm install
cd ../user
npm install
cd ../organiser
npm install
cd ../entryUser/entryuser
npm install

# Running the applications
# Backend
cd backend
npm run dev

# User Portal
cd ../user
npm run dev

# Organiser Portal
cd ../organiser
npm run dev

# Ticket Scanner
cd ../entryUser/entryuser
npm run dev
```

## 🧪 Testing

Testing frameworks and configurations are specific to each module. Continuous Integration pipelines are defined within the `.github/workflows` directory.

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## 🤝 Meet the Team

- [@BergaDev](https://github.com/BergaDev) – Matthew Bergamini
- [@khiemhuu](https://github.com/khiemhuu) – Huu Khiem Nguyen
- [@Abby010](https://github.com/Abby010) – Abhishek Mehta
- [@Pentpen1](https://github.com/Pentpen1) - Matthew Gale

Hope this revised version is helpful! Let me know if you have any other questions.
