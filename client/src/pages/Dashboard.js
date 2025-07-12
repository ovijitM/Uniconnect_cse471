import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Paper
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';

const Dashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {user?.university} • {user?.major} • {user?.year}
        </Typography>
      </Paper>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {users.length}
              </Typography>
              <Typography color="text.secondary">
                Students Available
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {new Set(users.map(u => u.university)).size}
              </Typography>
              <Typography color="text.secondary">
                Universities
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                0
              </Typography>
              <Typography color="text.secondary">
                Connections
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                0
              </Typography>
              <Typography color="text.secondary">
                Messages
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Students Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Connect with Students
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Discover and connect with students from your university and beyond
        </Typography>

        {loading ? (
          <Typography>Loading students...</Typography>
        ) : (
          <Grid container spacing={3}>
            {users.map((student) => (
              <Grid item xs={12} sm={6} md={4} key={student._id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          mr: 2,
                          bgcolor: 'primary.main'
                        }}
                      >
                        {student.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {student.name}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {student.university}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      {student.major && (
                        <Chip
                          label={student.major}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                      {student.year && (
                        <Chip
                          label={student.year}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    {student.bio && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {student.bio}
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 'auto' }}
                      onClick={() => console.log('Connect with', student.name)}
                    >
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && users.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No other students found
            </Typography>
            <Typography color="text.secondary">
              Be the first to invite your friends to join UniConnect!
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
