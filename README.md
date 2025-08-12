# UniConnect - University Club & Event Management System

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-v4+-lightgrey.svg)](https://expressjs.com/)

A comprehensive web application designed to connect university students with clubs and events, streamlining campus life management and fostering student engagement.

## 🚀 Features

### 👨‍🎓 Student Features

- **User Registration & Authentication** - Secure JWT-based authentication
- **University Club Discovery** - Browse and join clubs by category, university, or interests
- **Event Management** - Register for events, view upcoming activities
- **Personal Dashboard** - Track joined clubs, registered events, and profile management
- **Profile Customization** - Add interests, major, year, and personal information

### 👨‍💼 Club Admin Features

- **Club Request Management** - Submit requests to create new clubs
- **Event Creation** - Organize and manage club events with registration tracking
- **Member Management** - View club members and manage roles
- **Dashboard Analytics** - Track club performance and event attendance

### 🛠 Administrator Features

- **Club Request Approval** - Review and approve/reject club creation requests
- **System Overview** - Monitor all users, clubs, and events across the platform
- **University Management** - Manage university data and settings
- **User Role Management** - Assign roles and manage permissions

## 🏗 Architecture

### Frontend (React)

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AdminDashboard.js
│   │   ├── ClubAdminDashboard.js
│   │   └── Navbar.js
│   ├── pages/             # Page components
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Clubs.js
│   │   ├── Events.js
│   │   └── Profile.js
│   ├── context/           # React Context for state management
│   │   └── AuthContext.js
│   └── utils/             # Utility functions
└── package.json
```

### Backend (Node.js/Express)

```
server/
├── models/                # MongoDB schemas
│   ├── User.js
│   ├── Club.js
│   ├── Event.js
│   ├── ClubRequest.js
│   └── University.js
├── routes/                # API endpoints
│   ├── auth.js           # Authentication routes
│   ├── users.js          # User management
│   ├── clubs.js          # Club operations
│   ├── events.js         # Event management
│   ├── clubRequests.js   # Club request handling
│   └── universities.js   # University data
├── scripts/              # Database seeding & utilities
├── index.js              # Server entry point
└── package.json
```

## 🛠 Technology Stack

### Frontend

- **React 18** - UI framework with hooks and functional components
- **Material-UI (MUI)** - Modern React component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Day.js** - Date/time manipulation

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Development Tools

- **Nodemon** - Development server with hot reload
- **Dotenv** - Environment variable management
- **Express Validator** - Input validation and sanitization

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ovijitM/Uniconnect_cse471.git
cd Uniconnect_cse471
```

**Install server dependencies**

```bash
cd server
npm install
```

**Install client dependencies**

```bash
cd ../client
npm install
```

3. **Environment Configuration**

Create a `.env` file in the `server` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5001

# Database
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/uniconnect?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

4. **Database Setup**

Seed the database with initial data:

```bash
cd server

# Seed universities
node seedUniversities.js

# Create test users
node create-test-user.js
node createAdmin.js

# Seed sample clubs and events
node seedClubsAndEvents.js
```

5. **Start the Development Servers**

Terminal 1 - Backend:

```bash
cd server
npm run dev    # or npm start
```

Terminal 2 - Frontend:

```bash
cd client
npm start
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## 👤 Test Accounts

After running the setup scripts, you can use these test accounts:

### Administrator

- **Email**: `admin@university.com`
- **Password**: `admin123`
- **Role**: Administrator

### Club Admin

- **Email**: `testclubadmin@test.com`
- **Password**: `password123`
- **Role**: Club Admin

### Student

- **Email**: `student@university.com`
- **Password**: `student123`
- **Role**: Student

## 📱 Usage Guide

### For Students

1. **Register** with your university email
2. **Browse Clubs** by category or university
3. **Join Clubs** that match your interests
4. **Discover Events** and register to attend
5. **Manage Profile** with your academic information

### For Club Admins

1. **Request Club Creation** through the admin dashboard
2. **Create Events** once your club is approved
3. **Manage Members** and track attendance
4. **View Analytics** for your club's performance

### For Administrators

1. **Review Club Requests** from users
2. **Approve/Reject** new club applications
3. **Monitor System Activity** across all universities
4. **Manage User Roles** and permissions

## 🔧 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/profile      # Get current user profile
```

### Club Management

```http
GET    /api/clubs           # Get all clubs (filtered by university)
POST   /api/clubs           # Create new club (Admin only)
PUT    /api/clubs/:id       # Update club information
DELETE /api/clubs/:id       # Delete club
POST   /api/clubs/:id/join  # Join a club
```

### Event Management

```http
GET  /api/events                # Get all events
POST /api/events                # Create new event
GET  /api/events/:id           # Get event details
POST /api/events/:id/register  # Register for event
```

### Club Requests

```http
GET    /api/club-requests      # Get user's club requests
POST   /api/club-requests      # Submit new club request
PUT    /api/club-requests/:id  # Update request status (Admin)
DELETE /api/club-requests/:id  # Delete request
```

## 🗄 Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Student|Club Admin|Administrator),
  university: ObjectId (ref: University),
  major: String,
  year: String,
  bio: String,
  interests: [String],
  clubMemberships: [{club, role, joinedDate}],
  eventsAttended: [{event, attendedDate}]
}
```

### Club Model

```javascript
{
  name: String,
  description: String,
  category: String,
  university: ObjectId (ref: University),
  president: ObjectId (ref: User),
  members: [{user, role, joinedDate}],
  isActive: Boolean,
  membershipFee: Number,
  contactEmail: String
}
```

### Event Model

```javascript
{
  title: String,
  description: String,
  eventType: String,
  club: ObjectId (ref: Club),
  university: ObjectId (ref: University),
  startDate: Date,
  endDate: Date,
  venue: String,
  maxAttendees: Number,
  attendees: [ObjectId (ref: User)],
  isRegistrationRequired: Boolean,
  registrationFee: Number,
  isPublic: Boolean
}
```

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Material Design** - Clean, modern interface using Material-UI
- **Real-time Updates** - Dynamic content updates
- **Accessibility** - WCAG compliant design elements
- **Progressive Web App** - Offline capabilities and mobile optimization

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Role-based Access Control** - Different permissions for user roles
- **Input Validation** - Server-side validation for all inputs
- **CORS Configuration** - Proper cross-origin resource sharing
- **Environment Variables** - Sensitive data protection

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)

```bash
cd client
npm run build
# Deploy the 'build' folder to your hosting service
```

### Backend Deployment (Heroku/Railway)

```bash
cd server
# Make sure your package.json has the correct start script
# Deploy to your preferred hosting service
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Developer**: Ovijit M
- **Email**: ovijit@example.com
- **GitHub**: [@ovijitM](https://github.com/ovijitM)
- **Project Repository**: [Uniconnect_cse471](https://github.com/ovijitM/Uniconnect_cse471)

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Material-UI Components](https://mui.com/components/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/docs/)

---

**UniConnect** - Connecting University Communities, One Event at a Time! 🎓✨
