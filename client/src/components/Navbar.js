import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SchoolIcon from '@mui/icons-material/School';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <SchoolIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          UniConnect - Clubs & Events
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {user ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/dashboard"
                sx={{
                  textDecoration: 'none',
                  backgroundColor: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/clubs"
                sx={{
                  textDecoration: 'none',
                  backgroundColor: location.pathname === '/clubs' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                Clubs
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/events"
                sx={{
                  textDecoration: 'none',
                  backgroundColor: location.pathname === '/events' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                Events
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/profile"
                sx={{
                  textDecoration: 'none',
                  backgroundColor: location.pathname === '/profile' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                Profile
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ textDecoration: 'none' }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                variant="outlined"
                sx={{
                  textDecoration: 'none',
                  border: '1px solid white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
