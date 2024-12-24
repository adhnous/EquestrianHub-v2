# Equestrian Hub

A comprehensive equestrian facility management system that handles training classes, competitions, and horse management.

## Features

- Training Class Management
  - Create and manage training classes
  - Schedule classes with flexible time slots
  - Assign trainers and track participants
  - Multi-level class categorization (Beginner, Intermediate, Advanced)

- Competition Organization
  - Create and manage competitions
  - Handle participant registrations
  - Track results and rankings
  - Schedule management

- Horse Management
  - Track horse profiles and health records
  - Manage horse assignments
  - Monitor training progress
  - Schedule veterinary appointments

- User Management
  - Trainer profiles and specializations
  - Trainee progress tracking
  - User authentication and authorization
  - Role-based access control

- Multilingual Support
  - Full Arabic and English interface
  - RTL/LTR layout support
  - Localized date and time formats
  - Cultural adaptations

## Tech Stack

### Frontend
- React.js
- Material-UI for component design
- React Query for state management
- i18next for internationalization
- Axios for API communication

### Backend
- Node.js
- Express.js framework
- MongoDB database
- JWT authentication
- RESTful API design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB (v4.4 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/EquestrianHub.git
cd EquestrianHub
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Set up environment variables:
   - Create `.env` file in the backend directory:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/equestrianhub
     JWT_SECRET=your_jwt_secret
     ```
   - Create `.env` file in the frontend directory:
     ```
     REACT_APP_API_URL=http://localhost:3000/api
     ```

5. Start the development servers:
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm start
```

## Project Structure

```
EquestrianHub/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── locales/
│   │   └── utils/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the excellent component library
- i18next team for the internationalization framework
- The open-source community for their invaluable tools and libraries
