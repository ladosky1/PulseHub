# PulseHub

PulseHub is a real-time multimedia and community discussion platform built for discovering communities, connecting with other users, and participating in live conversations

## Features

- User registration and authentication
- Email verification
- Password reset and password change
- User profiles and relationship states
- Friend requests and friend management
- Community discovery and category filtering
- Community creation, joining, leaving, and deletion
- Real-time community discussions
- Direct messaging
- Typing indicators
- Message read status
- Notifications
- Real-time online presence
- Online member counts
- Responsive dark/light UI
- Loading, empty, and error states
- Persistent sessions backed by MongoDB

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Mantine UI
- React Router
- TanStack React Query
- Motion
- Tabler Icons
- Phosphor Icons

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Socket.IO
- express-session
- connect-mongo
- Nodemailer
- Zod
- bcrypt

## Architecture

PulseHub uses a client/server architecture:

```text
PulseHub
├── client/       # React + TypeScript frontend
└── server/       # Express + TypeScript backend

## Environment Variables
    Client
    VITE_API_URL=
    VITE_SOCKET_URL=
    Server
    NODE_ENV=
    PORT=
    MONGODB_URI=
    SESSION_SECRET=
    CLIENT_URL=
    CORS_ORIGIN=

    Email/SMTP configuration is also required by the backend.


    Running Locally
    Client
    cd client
    npm install
    npm run dev
    Server
    cd server
    npm install
    npm run dev
    Realtime Architecture

## PulseHub uses a shared Socket.IO connection for:

    Presence
    Messaging
    Typing indicators
    Read events
    Community messages
    Friend events
    Notifications

## Future Improvements
    Community ownership transfer
    Richer multimedia support
    Image/file uploads
    More community moderation tools
    Enhanced notifications
    Message deletion synchronization
    Improved search and discovery
    Additional profile customization
    Further mobile UX improvements
    Status

Author

Created by Oladoja Basit.
