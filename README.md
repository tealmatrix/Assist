# Personal Assistant App

A comprehensive web application for managing your personal, family, and professional life. This app helps you organize calendars, schedules, tasks, emails, and errands all in one place.

## Features

### 📅 Calendar & Scheduling
- Book and manage personal, family, and self-care appointments
- Track doctor visits, salon appointments, kids' activities, and homeschooling events
- Set appointment statuses (scheduled, confirmed, cancelled, completed)
- Add locations and attendees to appointments

### 📝 Lists & Organization
- Create and maintain digital lists for any purpose
- Organize by category (personal, family, shopping, household, work)
- Mark items as completed
- Set priority levels for list items

### 📓 Notes
- Create detailed notes with rich content
- Tag notes for easy searching and organization
- Keep track of important information and ideas

### 📧 Email Management
- Manage emails across multiple accounts
- Track email status (unread, read, flagged, responded, archived)
- Set priority levels (low, medium, high, urgent)
- Draft and organize professional emails

### 🎁 Research & Errands
- Track research tasks and shopping needs
- Organize gift purchases and deliveries
- Manage booking requests
- Add detailed notes and due dates
- Track progress with status updates (pending, in-progress, completed)

## Tech Stack

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **MongoDB** with **Mongoose** - Database and ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (v4.4 or higher)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd personal-assistant-app
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 4. Set up environment variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/personal-assistant
NODE_ENV=development
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Run Backend Only
```bash
npm run server
```

### Run Frontend Only
```bash
npm run client
```

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
personal-assistant-app/
├── server/
│   ├── index.js              # Express server entry point
│   ├── models/               # MongoDB schemas
│   │   ├── Appointment.js
│   │   ├── List.js
│   │   ├── Note.js
│   │   ├── Email.js
│   │   └── Errand.js
│   └── routes/               # API routes
│       ├── appointments.js
│       ├── lists.js
│       ├── notes.js
│       ├── emails.js
│       └── errands.js
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/       # React components
│       │   ├── Dashboard.js
│       │   ├── Calendar.js
│       │   ├── Lists.js
│       │   ├── Notes.js
│       │   ├── Emails.js
│       │   └── Errands.js
│       ├── App.js           # Main App component
│       ├── index.js         # React entry point
│       └── *.css            # Component styles
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## API Endpoints

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Lists
- `GET /api/lists` - Get all lists
- `GET /api/lists/:id` - Get single list
- `POST /api/lists` - Create new list
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Emails
- `GET /api/emails` - Get all emails
- `GET /api/emails/:id` - Get single email
- `POST /api/emails` - Create new email
- `PUT /api/emails/:id` - Update email
- `DELETE /api/emails/:id` - Delete email

### Errands
- `GET /api/errands` - Get all errands
- `GET /api/errands/:id` - Get single errand
- `POST /api/errands` - Create new errand
- `PUT /api/errands/:id` - Update errand
- `DELETE /api/errands/:id` - Delete errand

## Usage Guide

### Dashboard
The dashboard provides an overview of all your data:
- Total scheduled appointments
- Number of active lists
- Total notes
- Unread emails count
- Pending/in-progress errands

### Managing Appointments
1. Click "Add Appointment" to create a new appointment
2. Fill in the details (title, type, dates, location, etc.)
3. Click "Create Appointment"
4. Use "Edit" to modify or "Delete" to remove appointments

### Creating Lists
1. Click "Create List"
2. Enter a title and select a category
3. Add items one by one
4. Submit to save your list

### Taking Notes
1. Click "Create Note"
2. Add a title and content
3. Optionally add tags for organization
4. Save your note

### Managing Emails
1. Click "Add Email" to log an email
2. Enter sender, recipient, subject, and body
3. Set status and priority
4. Track and update as needed

### Tracking Errands
1. Click "Create Errand"
2. Enter title, description, and type
3. Set due date and priority
4. Update status as you progress
5. Add notes for research results or details

## Development

### Adding New Features
1. Create new model in `server/models/`
2. Create routes in `server/routes/`
3. Add route to `server/index.js`
4. Create React component in `client/src/components/`
5. Add route in `client/src/App.js`

### Database Schema
All models use MongoDB with Mongoose schemas. Each model includes:
- Automatic timestamps (`createdAt`, `updatedAt`)
- Validation rules
- Default values

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB is listening on the correct port

### Port Already in Use
Change the port in `.env`:
```env
PORT=3001
```

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check proxy setting in `client/package.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue on the repository.
