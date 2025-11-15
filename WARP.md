# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Setup
```bash
# Install all dependencies (root + client)
npm run install-all

# Copy environment configuration
cp .env.example .env
# Edit .env to configure MongoDB URI and port
```

### Running the Application
```bash
# Run both frontend and backend in development mode
npm run dev

# Run backend only (port 5000)
npm run server

# Run frontend only (port 3000)
npm run client

# Production build
npm run build
npm start
```

### Testing
```bash
# Frontend tests
cd client && npm test
```

### Prerequisites
- MongoDB must be running locally on port 27017 (default) or configured via MONGODB_URI
- Node.js v14+ required
- Ports 3000 (frontend) and 5000 (backend) must be available

## Architecture Overview

### Monorepo Structure
This is a full-stack application with a monorepo structure containing both client and server:
- **Root**: Backend server and project-wide scripts
- **client/**: React frontend application (Create React App)
- **server/**: Express.js backend API

### Backend Architecture
The backend follows a simple Express.js + MongoDB pattern:

**Entry Point**: `server/index.js`
- Initializes Express app with CORS and body-parser middleware
- Connects to MongoDB using Mongoose
- Mounts RESTful API routes under `/api/*`
- Exports the app for potential testing

**Data Layer Pattern**:
1. **Models** (`server/models/`): Mongoose schemas with validation, enums, and timestamps
   - All models use automatic timestamps (createdAt, updatedAt)
   - Models include data validation and default values
   - Standard schema pattern: Appointment, List, Note, Email, Errand

2. **Routes** (`server/routes/`): Express routers implementing standard CRUD operations
   - Each route file exports a router handling one resource
   - Standard endpoints: GET (all), GET (single), POST, PUT, DELETE
   - Consistent error handling with 404/400/500 status codes
   - Routes use async/await pattern

**API Pattern**: All routes follow `/api/{resource}` and `/api/{resource}/:id` convention

### Frontend Architecture
React SPA using React Router for navigation:

**Entry Point**: `client/src/index.js` → `App.js`

**Routing Structure** (`App.js`):
- Uses React Router v6 with BrowserRouter
- Top-level navigation bar with links to all sections
- Main routes: Dashboard, Calendar, Lists, Notes, Emails, Errands

**Component Organization**:
- Each feature has a dedicated component in `client/src/components/`
- Components handle their own API calls using axios
- Client-side routing via React Router
- Proxy configured in `client/package.json` to forward API calls to backend (port 5000)

**API Communication**:
- Frontend uses axios for HTTP requests
- All API endpoints accessed via relative URLs (proxied to backend)
- Backend runs on http://localhost:5000, frontend on http://localhost:3000

## Domain Models

The application manages five core entities:

1. **Appointments**: Calendar events with types (doctor, salon, kids-activity, etc.), dates, location, attendees, and status tracking
2. **Lists**: Categorized lists (personal, family, shopping, household, work) with items and completion status
3. **Notes**: Text notes with optional tags for organization
4. **Emails**: Email tracking with sender/recipient, status (unread/read/flagged), and priority levels
5. **Errands**: Tasks with types (research, shopping, gift, booking), due dates, priority, and status (pending/in-progress/completed)

Each model follows the same route and CRUD pattern for consistency.

## Key Conventions

### Adding New Features
When adding a new entity type:
1. Create Mongoose schema in `server/models/{EntityName}.js`
2. Create Express router in `server/routes/{entities}.js` with standard CRUD endpoints
3. Register route in `server/index.js` as `app.use('/api/{entities}', {entities}Routes)`
4. Create React component in `client/src/components/{EntityName}.js`
5. Add route in `client/src/App.js` using React Router

### Database Connection
- MongoDB connection string configurable via MONGODB_URI environment variable
- Default: `mongodb://localhost:27017/personal-assistant`
- Connection uses mongoose with useNewUrlParser and useUnifiedTopology options

### Environment Variables
Required in `.env` file:
- `PORT`: Backend server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment mode (development/production)

## Development Notes

### Port Configuration
- Backend: PORT environment variable (default 5000)
- Frontend: Fixed at 3000 (Create React App default)
- Frontend proxies API requests to backend via proxy setting in `client/package.json`

### Development Mode
Using `npm run dev` starts both servers concurrently:
- Backend runs with nodemon for auto-restart on changes
- Frontend runs with Create React App's development server with hot reload

### Build Process
Production build:
1. `npm run build` - Builds React app to `client/build/`
2. `npm start` - Runs production server (Note: serving static files not configured in current setup)

## Deployment

### Cloud Database (MongoDB Atlas)
The app can use MongoDB Atlas for cloud database:
- Free tier provides 512MB storage
- Get connection string from Atlas dashboard
- Update `MONGODB_URI` in `.env` to use Atlas connection string
- Connection string format: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/personal-assistant`

### Email Sending (Nodemailer)
Email functionality requires SMTP configuration:
- Gmail: Use App Password (not regular password)
- Configure via environment variables: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`
- Emails can be drafted, saved, and sent via "Send Email" button
- Sent emails are tracked with `isSent` flag and `sentAt` timestamp

### Deployment Options
See `DEPLOYMENT.md` for detailed deployment instructions:
- **Backend**: Render, Railway, or Vercel (requires Node.js hosting)
- **Frontend**: Netlify (static hosting)
- **Full Stack**: Vercel or Render (serve frontend from backend)

**Important**: `.env` file is gitignored - configure environment variables in your hosting platform
