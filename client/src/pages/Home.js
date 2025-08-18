import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import axios from 'axios';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredClubs, setFeaturedClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      const [clubsRes, eventsRes] = await Promise.all([
        axios.get('/api/clubs?limit=6'),
        axios.get('/api/events?limit=6')
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

  const handleClubClick = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
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

        {/* Horizontal Scrollable Cards */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: 10,
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: 10,
              '&:hover': {
                background: '#555',
              },
            },
          }}
        >
          {featuredClubs.length === 0 ? (
            <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No clubs available yet. Be the first to create one!
              </Typography>
            </Box>
          ) : (
            featuredClubs.map((club) => (
              <Card
                key={club._id}
                sx={{
                  minWidth: 280,
                  maxWidth: 280,
                  height: 200,
                  borderRadius: 2,
                  flexShrink: 0,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => handleClubClick(club._id)}
              >
                {/* Header */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    p: 1.5,
                    position: 'relative',
                    height: 80
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 6, right: 6 }}>
                    <Chip
                      label={club.category || 'General'}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontSize: '0.6rem',
                        height: 18
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'rgba(255,255,255,0.95)',
                        color: '#667eea',
                      }}
                    >
                      <GroupsIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {club.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.65rem'
                        }}
                      >
                        {club.members?.length || 0} members
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <CardContent sx={{ p: 1.5, height: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1.5,
                      fontSize: '0.75rem',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      flex: 1
                    }}
                  >
                    {club.description?.length > 70
                      ? `${club.description.substring(0, 70)}...`
                      : club.description || 'Join this amazing club!'}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                      {club.president?.name?.substring(0, 10) || 'TBA'}
                      {club.president?.name?.length > 10 ? '...' : ''}
                    </Typography>
                    {club.membershipFee > 0 && (
                      <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 600, fontSize: '0.7rem' }}>
                        ${club.membershipFee}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
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
          {/* Horizontal Scrollable Cards */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 2,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: 10,
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: 10,
                '&:hover': {
                  background: '#555',
                },
              },
            }}
          >
            {upcomingEvents.length === 0 ? (
              <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No upcoming events yet. Check back soon!
                </Typography>
              </Box>
            ) : (
              upcomingEvents.map((event) => (
                <Card
                  key={event._id}
                  sx={{
                    minWidth: 280,
                    maxWidth: 280,
                    height: 200,
                    borderRadius: 2,
                    flexShrink: 0,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => handleEventClick(event._id)}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #ff7043 0%, #f57c00 100%)',
                      p: 1.5,
                      position: 'relative',
                      height: 80
                    }}
                  >
                    <Box sx={{ position: 'absolute', top: 6, right: 6 }}>
                      <Chip
                        label={event.eventType || event.type || 'Event'}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontSize: '0.6rem',
                          height: 18
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'rgba(255,255,255,0.95)',
                          color: '#ff7043',
                        }}
                      >
                        <EventIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            lineHeight: 1.2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {event.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '0.65rem'
                          }}
                        >
                          {formatDate(event.startDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 1.5, height: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1.5,
                        fontSize: '0.75rem',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        flex: 1
                      }}
                    >
                      {event.description?.length > 70
                        ? `${event.description.substring(0, 70)}...`
                        : event.description || 'Join this exciting event!'}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                        {event.organizer?.name?.substring(0, 10) || event.club?.name?.substring(0, 10) || 'Unknown'}
                        {(event.organizer?.name?.length > 10 || event.club?.name?.length > 10) ? '...' : ''}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600, fontSize: '0.7rem' }}>
                        Free
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
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
