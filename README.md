# UniConnect - University Club & Event Management System

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-v4+-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive web application designed to connect university students with clubs and events, streamlining campus life management and fostering student engagement through modern web technologies.

## 🎯 Project Overview

UniConnect is a full-stack MERN application built for CSE471 that addresses the real-world problem of university community engagement. The platform serves as a centralized hub where students can discover clubs, join communities, attend events, and stay updated with announcements from their organizations.

### 🎓 Problem Statement

University students often struggle to find relevant clubs, stay updated with club activities, and engage meaningfully with campus communities. Traditional methods like bulletin boards, emails, and word-of-mouth are inefficient and fragmented.

### 💡 Our Solution

UniConnect provides a digital ecosystem that:

- Centralizes club and event discovery
- Enables real-time announcements and communication
- Streamlines membership and event management
- Provides analytics for club administrators
- Ensures secure, role-based access control

## 🚀 Features

### 👨‍🎓 Student Features

- **User Registration & Authentication** - Secure JWT-based authentication with role management
- **University Club Discovery** - Browse and join clubs by category, university, or interests
- **Event Management** - Register for events, view upcoming activities with real-time updates
- **Personal Dashboard** - Track joined clubs, registered events, and comprehensive profile management
- **Profile Customization** - Add interests, major, year, and personal information
- **Club Announcements** - Stay updated with real-time announcements from joined clubs
- **Interactive Community** - Like and comment on club announcements

### 👨‍💼 Club Admin Features

- **Club Request Management** - Submit requests to create new clubs with detailed information
- **Event Creation & Management** - Organize events with registration tracking and attendee management
- **Member Management** - View club members, manage roles, and track engagement
- **Announcement System** - Create, edit, and manage club announcements with priority levels
- **Dashboard Analytics** - Track club performance, event attendance, and member engagement
- **Team Recruitment** - Post recruitment opportunities and manage applications
- **Role-based Permissions** - Secure access control ensuring club-specific management

### 🛠 Administrator Features

- **Club Request Approval** - Review and approve/reject club creation requests with detailed workflow
- **System Overview** - Monitor all users, clubs, and events across the platform
- **University Management** - Manage university data, settings, and integrations
- **User Role Management** - Assign roles and manage permissions across the system
- **Content Moderation** - Monitor and moderate announcements and user-generated content
- **Analytics Dashboard** - Comprehensive system analytics and reporting

### 📢 **NEW: Advanced Announcement System**

- **Rich Content Creation** - Create announcements with title, content, type, and priority
- **Social Features** - Like, comment, and engage with club announcements
- **Permission Management** - Club-specific admin controls with president-based authorization
- **Content Organization** - Categorize by type (General, Event, Important, Urgent, Achievement)
- **Priority System** - High, Normal, Low priority with visual indicators
- **Pinned Announcements** - Highlight important updates at the top
- **Real-time Interactions** - Live commenting and engagement features

## 🏗 Architecture

### Frontend (React)

```
client/
├── public/                 # Static assets and PWA configuration
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── dashboards/     # Role-specific dashboards
│   │   │   ├── AdminDashboard.js
│   │   │   ├── ClubAdminDashboard.js
│   │   │   ├── StudentDashboard.js
│   │   │   └── UnifiedDashboard.js
│   │   ├── AdminDashboard.js
│   │   ├── Navbar.js
│   │   └── TeamRecruitmentSection.js
│   ├── pages/             # Page components
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Clubs.js
│   │   ├── ClubProfile.js  # Enhanced with announcement system
│   │   ├── Events.js
│   │   ├── EventProfile.js
│   │   └── Profile.js
│   ├── context/           # React Context for state management
│   │   └── AuthContext.js
│   └── utils/             # Utility functions and API helpers
└── package.json
```

### Backend (Node.js/Express)

```
server/
├── models/                # MongoDB schemas
│   ├── User.js           # User authentication and profile
│   ├── Club.js           # Club information and membership
│   ├── Event.js          # Event management and registration
│   ├── ClubRequest.js    # Club creation requests
│   ├── University.js     # University data and settings
│   ├── Announcement.js   # NEW: Club announcements with social features
│   └── TeamRecruitment.js # Team recruitment and applications
├── routes/                # API endpoints
│   ├── auth.js           # Authentication and authorization
│   ├── users.js          # User management and profiles
│   ├── clubs.js          # Club operations and membership
│   ├── events.js         # Event management and registration
│   ├── clubRequests.js   # Club request handling workflow
│   ├── universities.js   # University data management
│   ├── announcements.js  # NEW: Announcement CRUD and social features
│   └── teamRecruitment.js # Team recruitment operations
├── scripts/              # Database seeding & utilities
│   ├── seedUniversities.js
│   ├── seedClubsAndEvents.js
│   ├── createAdmin.js
│   └── create-test-user.js
├── index.js              # Server entry point with middleware setup
└── package.json
```

## � Project Progress & Development Timeline

### ✅ **Phase 1: Foundation (Completed)**

- [x] Project setup and architecture design
- [x] MongoDB database schema design and implementation
- [x] JWT-based authentication system
- [x] User registration and login functionality
- [x] Basic CRUD operations for users, clubs, and events
- [x] Role-based access control implementation

### ✅ **Phase 2: Core Features (Completed)**

- [x] Club discovery and browsing system
- [x] Event management and registration
- [x] Club membership management
- [x] University integration and multi-tenancy
- [x] Admin and Club Admin dashboards
- [x] Club request approval workflow

### ✅ **Phase 3: Enhanced Features (Completed)**

- [x] Advanced club profile pages with tabbed interface
- [x] Event management with attendee tracking
- [x] Responsive UI with Material-UI components
- [x] Profile customization and user preferences
- [x] Search and filtering capabilities

### 🎉 **Phase 4: Advanced Communication System (Recently Completed)**

- [x] **Full-featured Announcement System**
  - Club-specific announcement creation and management
  - Rich content editor with priority levels and categorization
  - Social engagement features (likes and comments)
  - Real-time interaction and updates
- [x] **Enhanced Permission System**
  - Club-specific admin controls
  - President-based authorization for announcements
  - Secure cross-club access prevention
- [x] **UI/UX Improvements**
  - Clean announcement cards with social features
  - Interactive comment system with real-time updates
  - Visual priority indicators and pinned announcements
- [x] **Backend Security Enhancements**
  - Async permission validation
  - Club-specific authorization checks
  - Comprehensive error handling and validation

### 🔄 **Phase 5: Advanced Features (In Planning)**

- [ ] Real-time notifications system
- [ ] Advanced analytics and reporting
- [ ] Mobile app development (React Native)
- [ ] Integration with university systems
- [ ] Advanced search with AI recommendations
- [ ] Event calendar synchronization

### 🎯 **Recent Achievements (August 2025)**

- **Announcement System**: Complete implementation with social features
- **Permission Management**: Enhanced security with club-specific controls
- **Code Quality**: ESLint warnings resolved, optimized React hooks
- **User Experience**: Improved navigation and interactive elements
- **Database Design**: Robust schema with relationship management

## �🛠 Technology Stack

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

**Option 1: Using the integrated development command (Recommended)**

```bash
# From the root directory
npm run dev    # Starts both frontend and backend concurrently
```

**Option 2: Manual setup with separate terminals**

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
- **Backend API (Development)**: http://localhost:5001
- **Backend API (Production)**: https://uniconnect-cse471.onrender.com
- **Development Tools**: Concurrent server monitoring with automatic restart

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
POST /api/auth/register     # User registration with role assignment
POST /api/auth/login        # User login with JWT token generation
GET  /api/auth/profile      # Get current user profile with permissions
PUT  /api/auth/profile      # Update user profile information
```

### Club Management

```http
GET    /api/clubs           # Get all clubs (filtered by university)
POST   /api/clubs           # Create new club (Admin only)
GET    /api/clubs/:id       # Get detailed club information
PUT    /api/clubs/:id       # Update club information
DELETE /api/clubs/:id       # Delete club (Admin only)
POST   /api/clubs/:id/join  # Join a club as a member
POST   /api/clubs/:id/leave # Leave a club
GET    /api/clubs/managed   # Get clubs managed by current user
```

### Event Management

```http
GET  /api/events                # Get all events with filtering options
POST /api/events                # Create new event (Club Admin only)
GET  /api/events/:id           # Get detailed event information
PUT  /api/events/:id           # Update event details
DELETE /api/events/:id         # Delete event
POST /api/events/:id/register  # Register for event
POST /api/events/:id/unregister # Unregister from event
GET  /api/events/managed       # Get events managed by current user
GET  /api/events/club/:clubId  # Get events for specific club
```

### **NEW: Announcement System**

```http
GET    /api/announcements/club/:clubId          # Get all announcements for a club
POST   /api/announcements/club/:clubId          # Create new announcement (Club Admin only)
PUT    /api/announcements/:id                   # Update announcement
DELETE /api/announcements/:id                   # Delete announcement
POST   /api/announcements/:id/like              # Like/unlike announcement
POST   /api/announcements/:id/comments          # Add comment to announcement
PUT    /api/announcements/:id/comments/:commentId # Update comment
DELETE /api/announcements/:id/comments/:commentId # Delete comment
GET    /api/announcements/user/feed             # Get personalized announcement feed
```

### Club Requests

```http
GET    /api/club-requests      # Get user's club requests
POST   /api/club-requests      # Submit new club request
GET    /api/club-requests/:id  # Get specific request details
PUT    /api/club-requests/:id  # Update request status (Admin)
DELETE /api/club-requests/:id  # Delete request
```

### University Management

```http
GET  /api/universities         # Get all universities
POST /api/universities         # Create university (Admin only)
GET  /api/universities/:id     # Get university details
PUT  /api/universities/:id     # Update university information
```

## 🗄 Database Schema

### User Model

```javascript
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed with bcrypt),
  role: String (Student|Club Admin|Administrator),
  university: ObjectId (ref: University),
  major: String,
  year: String,
  bio: String,
  interests: [String],
  profilePicture: String (URL),
  clubMemberships: [{
    club: ObjectId (ref: Club),
    role: String,
    joinedDate: Date
  }],
  eventsAttended: [{
    event: ObjectId (ref: Event),
    attendedDate: Date,
    attended: Boolean
  }],
  isActive: Boolean,
  lastLogin: Date,
  timestamps: { createdAt, updatedAt }
}
```

### Club Model

```javascript
{
  name: String (unique, required),
  description: String (required),
  category: String (enum: Academic, Sports, Cultural, etc.),
  university: ObjectId (ref: University, required),
  president: ObjectId (ref: User),
  members: [{
    user: ObjectId (ref: User),
    role: String (Member|Officer|President|Vice President|Secretary),
    joinedDate: Date
  }],
  advisors: [String],
  contactEmail: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  meetingSchedule: {
    day: String,
    time: String,
    location: String
  },
  logo: String (URL),
  founded: Date,
  isActive: Boolean,
  membershipFee: Number,
  timestamps: { createdAt, updatedAt }
}
```

### Event Model

```javascript
{
  title: String (required),
  description: String (required),
  eventType: String (enum: Workshop, Seminar, Competition, etc.),
  club: ObjectId (ref: Club, required),
  university: ObjectId (ref: University, required),
  startDate: Date (required),
  endDate: Date (required),
  startTime: String (required),
  endTime: String (required),
  venue: String (required),
  maxAttendees: Number,
  registrationFee: Number,
  registrationDeadline: Date,
  isRegistrationRequired: Boolean,
  attendees: [{
    user: ObjectId (ref: User),
    registeredAt: Date,
    attended: Boolean
  }],
  organizers: [ObjectId (ref: User)],
  tags: [String],
  poster: String (URL),
  isPublic: Boolean,
  timestamps: { createdAt, updatedAt }
}
```

### **NEW: Announcement Model**

```javascript
{
  club: ObjectId (ref: Club, required),
  author: ObjectId (ref: User, required),
  title: String (required, max: 200),
  content: String (required, max: 2000),
  type: String (enum: General|Event|Important|Urgent|Achievement),
  priority: String (enum: Low|Normal|High|Urgent),
  isPinned: Boolean,
  isActive: Boolean,
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    fileSize: Number
  }],
  tags: [String],
  likes: [{
    user: ObjectId (ref: User),
    likedAt: Date
  }],
  comments: [{
    author: ObjectId (ref: User),
    content: String (max: 500),
    createdAt: Date,
    updatedAt: Date
  }],
  views: Number,
  scheduledFor: Date, // For future announcements
  expiresAt: Date,    // Auto-deactivation
  targetAudience: String (enum: Members|Officers|Public),

  // Virtual fields
  likeCount: Number (virtual),
  commentCount: Number (virtual),
  isLikedByUser: Boolean (virtual),

  timestamps: { createdAt, updatedAt }
}
```

### ClubRequest Model

```javascript
{
  requester: ObjectId (ref: User, required),
  university: ObjectId (ref: University, required),
  clubName: String (required),
  description: String (required),
  category: String (required),
  purpose: String,
  expectedMembers: Number,
  advisors: [String],
  constitution: String (URL),
  status: String (enum: Pending|Approved|Rejected),
  reviewedBy: ObjectId (ref: User),
  reviewDate: Date,
  rejectionReason: String,
  timestamps: { createdAt, updatedAt }
}
```

## � Key Achievements & Technical Highlights

### 🎯 **Architecture Excellence**

- **Scalable MERN Stack**: Full-stack JavaScript application with modern architecture
- **RESTful API Design**: Well-structured endpoints with consistent response patterns
- **Database Optimization**: Efficient MongoDB schema with proper indexing and relationships
- **Component Architecture**: Reusable React components with Material-UI integration

### 🔒 **Security Implementation**

- **JWT Authentication**: Secure token-based authentication with role-based access
- **Password Security**: bcrypt hashing with salt rounds for password protection
- **Permission Matrix**: Comprehensive role-based permissions with club-specific controls
- **Input Validation**: Server-side validation for all API endpoints
- **CORS Configuration**: Proper cross-origin resource sharing setup

### 📱 **User Experience**

- **Responsive Design**: Mobile-first approach with Material-UI responsive components
- **Real-time Interactions**: Live commenting and engagement features
- **Progressive Web App**: Offline capabilities and mobile optimization
- **Accessibility**: WCAG-compliant design elements and keyboard navigation
- **Performance Optimization**: Code splitting, lazy loading, and optimized bundles

### ⚡ **Advanced Features**

- **Social Engagement System**: Like, comment, and interaction features
- **Content Management**: Rich announcement system with categorization and priorities
- **Analytics Ready**: Built-in tracking for user engagement and system metrics
- **Multi-tenancy**: University-specific data isolation and management
- **Advanced Permissions**: Club-specific admin controls with inheritance

### 🚀 **Development Best Practices**

- **Clean Code**: ESLint configuration with consistent coding standards
- **Component Optimization**: useCallback and useMemo for performance optimization
- **Error Handling**: Comprehensive error boundaries and user feedback
- **API Documentation**: Well-documented endpoints with clear request/response formats
- **Database Seeding**: Automated scripts for development and testing data

## �🎨 UI/UX Features

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
- **Course**: CSE471 - System Analysis and Design
- **University**: North South University
- **Project Type**: Full-Stack Web Application (MERN Stack)
- **GitHub**: [@ovijitM](https://github.com/ovijitM)
- **Project Repository**: [Uniconnect_cse471](https://github.com/ovijitM/Uniconnect_cse471)

### 🎓 Academic Context

This project was developed as part of CSE471 coursework, demonstrating:

- **System Analysis**: Requirements gathering and user story development
- **Database Design**: Entity-relationship modeling and schema optimization
- **Software Architecture**: Full-stack application design and implementation
- **User Experience**: Interface design and usability testing
- **Project Management**: Agile development practices and version control

## 📊 Project Statistics

- **Total Files**: 50+ source files
- **Lines of Code**: 10,000+ lines across frontend and backend
- **API Endpoints**: 25+ RESTful endpoints
- **Database Models**: 6 comprehensive MongoDB schemas
- **React Components**: 30+ reusable components
- **Development Time**: 3+ months of active development
- **Features Implemented**: 20+ major features with full CRUD operations

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Material-UI Components](https://mui.com/components/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/docs/)

---

**UniConnect** - Connecting University Communities, One Event at a Time! 🎓✨
