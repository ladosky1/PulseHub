# PulseHub

PulseHub is a real-time multimedia and community discussion platform built for discovering communities, connecting with other users, and participating in live conversations.

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
- Tailwind CSS
- React Router
- TanStack React Query
- Motion
- Tabler Icons
- Phosphor Icons
- Recharts

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
```

The backend follows a layered structure:

```text
Route
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Model / Database
```

Controllers remain thin while business and database logic is handled by services.

## Authentication

PulseHub uses server-side sessions rather than JWT authentication.

```text
Browser
   ↓
Session Cookie
   ↓
Express Session
   ↓
MongoDB / MongoStore
```

The session cookie is:

```text
pulsehub.sid
```

Socket.IO uses the same authenticated session.

## Real-Time System

PulseHub uses a shared Socket.IO connection.

The frontend establishes one connection and feature-specific hooks subscribe to the relevant events.

Realtime functionality includes:

- Online/offline presence
- Friend request events
- Friend relationship events
- Direct messages
- Message read events
- Typing indicators
- Community join/leave events
- Community messages
- Notifications

Presence supports multiple browser tabs and connections. A user is considered offline only after their final active socket disconnects.

## API

The backend exposes the following major API areas:

```text
/api/health
/api/auth
/api/users
/api/friends
/api/messages
/api/communities
/api/notifications
```

### Health Check

```http
GET /api/health
```

## Environment Variables

Environment files are intentionally excluded from Git.

### Client

The frontend uses Vite environment variables:

```env
VITE_API_URL=
VITE_SOCKET_URL=
```

`VITE_API_URL` should point to the REST API base URL.

Example:

```env
VITE_API_URL=https://api.example.com/api
```

`VITE_SOCKET_URL` should point to the backend server origin without `/api`.

Example:

```env
VITE_SOCKET_URL=https://api.example.com
```

Never place secrets in `VITE_*` variables because frontend environment variables are exposed to the browser at build time.

### Server

The exact backend environment variable names are defined by the server environment configuration.

Production configuration includes values for:

```env
NODE_ENV=
PORT=
MONGODB_URI=
SESSION_SECRET=
CLIENT_URL=
CORS_ORIGIN=
```

Email/SMTP configuration is also required.

The exact email environment variable names should be taken from the backend environment configuration rather than assumed from this README.

Do not commit real environment files, database credentials, session secrets, SMTP passwords, or other secrets.

## Local Development

### Client

```bash
cd client
npm install
npm run dev
```

### Server

```bash
cd server
npm install
npm run dev
```

The exact production build and start commands are defined in the corresponding `package.json` files.

## Database

PulseHub uses MongoDB Atlas with Mongoose.

MongoDB stores:

- Users
- Friend relationships
- Direct messages
- Communities
- Community messages
- Notifications
- Persistent sessions

Notifications automatically expire after 30 days through a MongoDB TTL index.

## Email

Nodemailer is used for authentication-related emails.

Supported email flows include:

- Email verification
- Resending verification codes
- Password reset

Production email credentials must be configured through the hosting provider's environment-variable system.

## UI / Design

PulseHub follows a restrained, premium social-product design direction.

Design principles include:

- Dark-first interface
- Clean neutral/light mode
- Strong visual hierarchy
- Consistent spacing
- Inter for body and UI text
- Space Grotesk for headings and branding
- Restrained motion
- Responsive layouts
- Minimal decorative effects

The PulseHub brand uses a blue → indigo → violet gradient primarily within the brand mark rather than throughout the interface.

Motion uses subtle opacity, vertical movement, and press interactions while respecting reduced-motion preferences.

## Security

Production deployment should ensure:

- HTTPS
- Secure HTTP-only session cookies
- Strong session secret
- Restricted CORS origins
- Secure MongoDB credentials
- Secure SMTP credentials
- Request validation with Zod
- Password hashing with bcrypt
- Sensitive user fields excluded from normal queries
- Authentication on protected endpoints
- Production errors do not expose internal stack traces
- Rate limiting for sensitive authentication endpoints

## Production Deployment

The intended deployment architecture is:

```text
                    Custom Domain
                         │
              ┌──────────┴──────────┐
              │                     │
         Frontend               Backend
          Hosting               Hosting
              │                     │
              │                Express + Socket.IO
              │                     │
              └──────────┬──────────┘
                         │
                    MongoDB Atlas
```

The frontend and backend remain separate services while being presented as one PulseHub product through the custom domain.

The backend host must support long-running Node.js processes and persistent WebSocket/Socket.IO connections.

Production configuration must correctly handle:

- CORS
- Session cookies
- Credentials
- HTTPS
- Socket.IO connections
- WebSocket upgrades

## V1 Limitations

### Community Ownership

A user cannot currently delete their account while they are the administrator of a community.

Community ownership transfer is not currently implemented.

### Realtime Deletion Events

Individual message deletion, notification deletion, delete-all notifications, and community deletion currently rely on HTTP/database state as the source of truth rather than dedicated Socket.IO deletion events.

### Community Membership

Community membership is stored directly in the community document rather than in a separate membership collection.

## Project Status

PulseHub V1 functionality is complete enough for production deployment.

Current major systems include:

- Authentication
- Friends
- Profiles
- Communities
- Direct messaging
- Community messaging
- Notifications
- Persistent sessions
- Email authentication flows
- Socket.IO
- Realtime presence
- Responsive UI

The current deployment phase is:

```text
Local V1
   ↓
GitHub
   ↓
Production Backend
   ↓
Production Frontend
   ↓
Database / Email / Socket / Session Configuration
   ↓
Custom Domain
   ↓
Final Production Testing
```

## Author

PulseHub was built as a full-stack development project focused on real-world application architecture, authentication, databases, realtime communication, responsive UI, and production deployment.

Oladoja Basit.