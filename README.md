# UniConnect - MERN Stack Application

A modern university student networking platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **User Authentication**: Secure login and registration system
- **Student Profiles**: Comprehensive profiles with university info, majors, and interests
- **Student Discovery**: Browse and connect with students from various universities
- **Responsive Design**: Modern UI built with Material-UI
- **Real-time Updates**: Dynamic dashboard with student statistics

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend

- **React** - Frontend framework
- **Material-UI** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd uniconnect_cse471
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   npm run install-server

   # Install client dependencies
   npm run install-client
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server` directory with:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority&appName=your_app_name
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_URL=http://localhost:3000
   ```

   **For MongoDB Atlas (Recommended):**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string and replace the MONGODB_URI
   - Make sure to whitelist your IP address

4. **Database Setup**

   **Option A: MongoDB Atlas (Cloud - Recommended)**
   - No local installation required
   - Already configured if you used the Atlas connection string above

   **Option B: Local MongoDB (Optional)**
   Make sure MongoDB is running on your system:

   ```bash
   # For macOS with Homebrew
   brew services start mongodb-community

   # For Ubuntu/Linux
   sudo systemctl start mongod

   # For Windows
   net start MongoDB
   ```

5. **Run the application**

   ```bash
   # Run both frontend and backend concurrently
   npm run dev

   # Or run them separately:
   # Backend only (port 5000)
   npm run server

   # Frontend only (port 3000)
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
uniconnect_cse471/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   ├── .env               # Environment variables
│   └── package.json
└── package.json           # Root package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (for discovery)

## Available Scripts

### Root Level

- `npm run dev` - Run both frontend and backend
- `npm run server` - Run backend only
- `npm run client` - Run frontend only
- `npm run install-all` - Install all dependencies
- `npm run build` - Build frontend for production

### Server

- `npm start` - Start server in production
- `npm run dev` - Start server with nodemon (development)

### Client

- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Environment Variables

### Server (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority&appName=your_app_name
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000
```

**Important**: Replace the MongoDB URI with your actual Atlas connection string or local MongoDB URL.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue in the repository.
