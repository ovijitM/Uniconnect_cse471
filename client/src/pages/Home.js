import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const Home = () => {
  const { user } = useAuth();
  const [featuredClubs, setFeaturedClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      const [clubsRes, eventsRes] = await Promise.all([
        axios.get('/api/clubs?limit=3'),
        axios.get('/api/events?limit=3')
      ]);

      setFeaturedClubs(clubsRes.data.clubs || []);
      setUpcomingEvents(eventsRes.data.events || []);
    } catch (error) {
      console.error('Error fetching featured content:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const features = [
    {
      icon: <GroupsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Join University Clubs',
      description: 'Discover and join clubs that match your interests and passions.'
    },
    {
      icon: <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Attend Events',
      description: 'Register for workshops, seminars, competitions, and social events.'
    },
    {
      icon: <PersonAddIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Meet Like-minded People',
      description: 'Connect with fellow students who share your interests through clubs.'
    },
    {
      icon: <CalendarTodayIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Stay Updated',
      description: 'Never miss important club meetings and university events.'
    }
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          color: 'white',
          mb: 6
        }}
      >
        <SchoolIcon sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          UniConnect - Clubs & Events
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
          Your gateway to university clubs and events. Join communities, attend events, and make lasting connections.
        </Typography>

        {user ? (
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Go to Dashboard
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        )}
      </Box>

      {/* Featured Clubs Section */}
      <Box sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              Featured Clubs
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Discover popular clubs at your university
            </Typography>
          </Box>
          <Button component={Link} to="/clubs" variant="outlined" size="large">
            View All Clubs
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredClubs.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                No clubs available yet. Be the first to create one!
              </Typography>
            </Grid>
          ) : (
            featuredClubs.map((club) => (
              <Grid item xs={12} sm={6} md={4} key={club._id}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          mr: 2,
                          bgcolor: 'primary.main',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        <GroupsIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="700" gutterBottom>
                          {club.name}
                        </Typography>
                        <Chip
                          label={club.category}
                          size="small"
                          color="primary"
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        lineHeight: 1.6,
                        minHeight: '44px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {club.description?.length > 100
                        ? `${club.description.substring(0, 100)}...`
                        : club.description || 'Join this amazing club!'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5
                        }}
                      >
                        <GroupsIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                        {club.members?.length || 0} members
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* Upcoming Events Section */}
      <Box sx={{ py: 6, bgcolor: 'grey.50', borderRadius: 2, mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: 3 }}>
          <Box>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              Upcoming Events
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Don't miss these exciting events
            </Typography>
          </Box>
          <Button component={Link} to="/events" variant="contained" size="large">
            View All Events
          </Button>
        </Box>

        <Box sx={{ px: 3 }}>
          <Grid container spacing={3}>
            {upcomingEvents.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  No upcoming events yet. Check back soon!
                </Typography>
              </Grid>
            ) : (
              upcomingEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event._id}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            mr: 2,
                            bgcolor: 'secondary.main',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        >
                          <EventIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="700" gutterBottom>
                            {event.title}
                          </Typography>
                          <Chip
                            label={event.eventType || event.type || 'Event'}
                            size="small"
                            color="secondary"
                            variant="filled"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          lineHeight: 1.6,
                          minHeight: '44px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {event.description?.length > 100
                          ? `${event.description.substring(0, 100)}...`
                          : event.description || 'Join this exciting event!'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 2,
                            bgcolor: 'rgba(255, 152, 0, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5
                          }}
                        >
                          <CalendarTodayIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800' }}>
                          {formatDate(event.startDate)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        by {event.organizer?.name || event.club?.name || 'Unknown'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          fontWeight="bold"
          color="text.primary"
        >
          Why Choose UniConnect?
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Discover the features that make student connections meaningful
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA Section */}
      {!user && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            bgcolor: 'grey.50',
            borderRadius: 2,
            mt: 6
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Ready to Connect?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of students already using UniConnect
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Join Now - It's Free!
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Home;
