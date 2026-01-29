# UrbanNest - Real Estate Management System

A comprehensive real estate management platform built with MERN stack.

## Project Structure

- `backend/` - Express.js API server
- `frontend/` - React.js frontend application

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` file with your configuration:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GEMINI_API_KEY` - Optional: For AI features
- `PORT` - Server port (default: 5000)

5. Start the server:
```bash
npm run dev
# or
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features

- User authentication (login/register)
- Property management
- Project and unit management
- Booking system
- Messaging system
- AI-powered recommendations
- Admin dashboard
- Agent dashboard

## Default Roles

- **User**: Can browse properties, make bookings, save favorites
- **Agent**: Can manage properties, view analytics
- **Admin**: Full system access

## API Endpoints

- `/api/auth` - Authentication
- `/api/properties` - Property management
- `/api/projects` - Project management
- `/api/units` - Unit management
- `/api/bookings` - Booking system
- `/api/messages` - Messaging
- `/api/admin` - Admin functions

## Development

The project uses:
- Express.js for backend API
- React.js with Vite for frontend
- MongoDB with Mongoose for database
- Tailwind CSS for styling
- React Query for state management
- JWT for authentication
