import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/api';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Tabs,
    Tab,
    Avatar,
    CardActions,
    Paper,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../../auth/context/AuthContext';
import axios from 'axios';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TeamRecruitmentHub from '../shared/TeamRecruitmentHub';
import EnhancedProfile from '../shared/EnhancedProfile';

// Student Dashboard Component for Regular Students
const StudentDashboard = () => {
    const { user, refreshUser, token } = useAuth();
    const navigate = useNavigate();
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    const fetchClubsAndEvents = useCallback(async () => {
        try {
            const universityId = user?.university?._id || user?.university;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const [clubsRes, eventsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/clubs${universityId ? `?university=${universityId}` : ''}`, { headers }),
            axios.get(`${API_BASE_URL}/events${universityId ? `?university=${universityId}` : ''}`, { headers })
            ]);

            setClubs(clubsRes.data.clubs || []);
            setEvents(eventsRes.data.events || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setClubs([]);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [user, token]);

    useEffect(() => {
        if (user && user.clubMemberships !== undefined && user.eventsAttended !== undefined) {
            fetchClubsAndEvents();
        }
    }, [fetchClubsAndEvents, user]);

    // Debug user data - remove in production
    useEffect(() => {
        if (user) {
            console.log('=== FRONTEND DEBUG - USER DATA ===');
            console.log('Current user data:', user);
            console.log('User club memberships:', user?.clubMemberships);
            console.log('User events attended:', user?.eventsAttended);
            console.log('User data fully loaded:', user.clubMemberships !== undefined && user.eventsAttended !== undefined);
            console.log('Events attended count:', user?.eventsAttended?.length || 0);
            console.log('Club memberships count:', user?.clubMemberships?.length || 0);
        }
    }, [user]);

    const handleJoinClub = async (clubId) => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}/clubs/${clubId}/join`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.message) {
                alert(response.data.message);
                // Refresh user data first to get updated clubMemberships
                await refreshUser();
                // Then refresh clubs to get updated member counts
                await fetchClubsAndEvents();
            }
        } catch (error) {
            console.error('Error joining club:', error);
            alert(error.response?.data?.message || 'Failed to join club');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterEvent = async (eventId) => {
        try {
            setLoading(true);
            console.log('=== REGISTERING FOR EVENT ===');
            console.log('Event ID:', eventId);
            console.log('User events before registration:', user?.eventsAttended?.length || 0);
            
            const response = await axios.post(`${API_BASE_URL}/events/${eventId}/register`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.message) {
                alert(response.data.message);
                console.log('✅ Registration successful, refreshing data...');
                
                // Force a complete data refresh
                console.log('🔄 Starting data refresh sequence...');
                
                // First refresh user data
                const userRefreshResult = await refreshUser();
                console.log('User refresh result:', userRefreshResult);
                
                // Then refresh events and clubs
                await fetchClubsAndEvents();
                console.log('✅ Events and clubs data refreshed');
                
                // Force a small delay to ensure state updates
                setTimeout(() => {
                    console.log('🎯 Post-registration data check:');
                    console.log('User events attended:', user?.eventsAttended?.length || 0);
                    console.log('Calculated user events:', userEvents.length);
                }, 500);
            }
        } catch (error) {
            console.error('❌ Error registering for event:', error);
            alert(error.response?.data?.message || 'Failed to register for event');
        } finally {
            setLoading(false);
        }
    };

    const handleForceRefresh = useCallback(async () => {
        setLoading(true);
        console.log('🔄 FORCE REFRESH TRIGGERED');
        try {
            console.log('Refreshing user data...');
            const userResult = await refreshUser();
            console.log('User refresh result:', userResult);
            
            console.log('Refreshing clubs and events...');
            await fetchClubsAndEvents();
            console.log('✅ Force refresh completed');
            
            // Log current state after refresh
            setTimeout(() => {
                console.log('📊 Current state after force refresh:');
                console.log('User events attended:', user?.eventsAttended?.length || 0);
                console.log('Available events:', events?.length || 0);
                console.log('Available clubs:', clubs?.length || 0);
            }, 1000);
        } catch (error) {
            console.error('❌ Error during force refresh:', error);
        } finally {
            setLoading(false);
        }
    }, [refreshUser, fetchClubsAndEvents, user, events, clubs]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get user's joined clubs - SIMPLIFIED FOR DEBUGGING
    const userClubs = useMemo(() => {
        if (!user?.clubMemberships || !clubs.length) {
            console.log('No user memberships or clubs available');
            return [];
        }

        const result = [];
        console.log('=== CLUB MEMBERSHIP DEBUG ===');
        console.log('User club memberships:', user.clubMemberships);
        console.log('Available clubs:', clubs.map(c => ({ id: c._id, name: c.name })));

        user.clubMemberships.forEach(membership => {
            const membershipClubId = membership.club?._id || membership.club;
            console.log('Looking for club with ID:', membershipClubId);

            const foundClub = clubs.find(club => club._id === membershipClubId);
            if (foundClub) {
                console.log('Found matching club:', foundClub.name);
                result.push(foundClub);
            } else {
                console.log('No matching club found for ID:', membershipClubId);
            }
        });

        console.log('Final userClubs result:', result.map(c => c.name));
        return result;
    }, [user, clubs]);

    // Get user's registered events - ENHANCED DEBUGGING
    const userEvents = useMemo(() => {
        console.log('=== CALCULATING USER EVENTS ===');
        console.log('User object:', user);
        console.log('User eventsAttended:', user?.eventsAttended);
        console.log('Events array length:', events?.length || 0);
        
        if (!user?.eventsAttended) {
            console.log('❌ No user.eventsAttended found');
            return [];
        }
        
        if (!events || events.length === 0) {
            console.log('❌ No events available');
            return [];
        }

        const result = [];
        console.log('📋 Processing', user.eventsAttended.length, 'attended events');
        
        user.eventsAttended.forEach((attendance, index) => {
            console.log(`\n--- Processing attendance ${index + 1} ---`);
            console.log('Attendance object:', attendance);
            
            // Handle different possible data structures
            let eventId = null;
            if (typeof attendance === 'string') {
                eventId = attendance;
            } else if (attendance?.event) {
                if (typeof attendance.event === 'string') {
                    eventId = attendance.event;
                } else if (attendance.event._id) {
                    eventId = attendance.event._id;
                }
            } else if (attendance._id) {
                eventId = attendance._id;
            }
            
            console.log('Extracted event ID:', eventId);
            
            if (eventId) {
                const foundEvent = events.find(event => {
                    const match = event._id === eventId || event._id?.toString() === eventId?.toString();
                    if (match) {
                        console.log('✅ Found matching event:', event.title);
                    }
                    return match;
                });
                
                if (foundEvent) {
                    result.push(foundEvent);
                } else {
                    console.log('❌ No matching event found for ID:', eventId);
                    console.log('Available event IDs:', events.map(e => e._id));
                }
            } else {
                console.log('❌ Could not extract event ID from attendance:', attendance);
            }
        });

        console.log('\n🎯 FINAL RESULT:');
        console.log('User events count:', result.length);
        console.log('User events titles:', result.map(e => e.title));
        return result;
    }, [user, events]);

    // Debug events and clubs data
    useEffect(() => {
        console.log('=== FRONTEND DEBUG - EVENTS & CLUBS ===');
        console.log('Available events:', events.length);
        console.log('Available clubs:', clubs.length);
        console.log('User events (calculated):', userEvents.length);
        console.log('User clubs (calculated):', userClubs.length);
    }, [events, clubs, userEvents, userClubs]);

    const renderClubs = (clubList) => (
        <Grid container spacing={3}>
            {clubList.length === 0 ? (
                <Grid item xs={12}>
                    <Box textAlign="center" py={4}>
                        <GroupsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            {tabValue === 0 ? 'You haven\'t joined any clubs yet' : 'No clubs found'}
                        </Typography>
                        <Typography color="text.secondary">
                            {tabValue === 0 ? 'Explore clubs to find ones that interest you!' : 'Check back later for new clubs'}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                clubList.map((club) => (
                    <Grid item xs={12} sm={6} md={4} key={club._id}>
                        <Card
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3
                                }
                            }}
                            onClick={() => navigate(`/clubs/${club._id}`)}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                                        <GroupsIcon />
                                    </Avatar>
                                    <Box flexGrow={1}>
                                        <Typography variant="h6" fontWeight="bold" noWrap>
                                            {club.name}
                                        </Typography>
                                        <Chip label={club.category} size="small" color="primary" variant="outlined" />
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
                                    {club.description?.length > 100 ?
                                        `${club.description.substring(0, 100)}...` :
                                        club.description || 'No description available'
                                    }
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        👥 {club.members?.length || 0} members
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        💰 ${club.membershipFee || 0}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    🎯 President: {club.president?.name || 'TBD'}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                {!userClubs.find(uc => uc._id === club._id) ? (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<PersonAddIcon />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleJoinClub(club._id);
                                        }}
                                        fullWidth
                                    >
                                        Join Club
                                    </Button>
                                ) : (
                                    <Chip label="Member" color="success" size="small" />
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))
            )}
        </Grid>
    );

    const renderEvents = (eventList) => (
        <Grid container spacing={3}>
            {eventList.length === 0 ? (
                <Grid item xs={12}>
                    <Box textAlign="center" py={4}>
                        <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No events found
                        </Typography>
                        <Typography color="text.secondary">
                            Check back later for upcoming events
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                eventList.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                        <Card
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3
                                }
                            }}
                            onClick={() => navigate(`/events/${event._id}`)}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'secondary.main' }}>
                                        <EventIcon />
                                    </Avatar>
                                    <Box flexGrow={1}>
                                        <Typography variant="h6" fontWeight="bold" noWrap>
                                            {event.title}
                                        </Typography>
                                        <Chip
                                            label={event.eventType || event.type || 'Event'}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
                                    {event.description?.length > 100 ?
                                        `${event.description.substring(0, 100)}...` :
                                        event.description || 'No description available'
                                    }
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(event.startDate)}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {event.venue?.name || event.venue || 'TBD'}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        👥 {event.attendees?.length || 0} attendees
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        💰 ${event.registrationFee || 0}
                                    </Typography>
                                </Box>

                                <Typography variant="body2" color="text.secondary">
                                    🏛️ {event.club?.name || 'Unknown Club'}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                {event.registrationRequired && !userEvents.find(ue => ue._id === event._id) ? (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="secondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRegisterEvent(event._id);
                                        }}
                                        fullWidth
                                    >
                                        Register
                                    </Button>
                                ) : userEvents.find(ue => ue._id === event._id) ? (
                                    <Chip label="Registered" color="success" size="small" />
                                ) : (
                                    <Chip label="Open Event" color="info" size="small" />
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))
            )}
        </Grid>
    );

    if (loading || !user || user.clubMemberships === undefined || user.eventsAttended === undefined) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
                <Typography variant="h4" sx={{ ml: 2 }}>
                    Loading Your Dashboard...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Welcome Header */}
            <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h3" fontWeight="bold">
                            Welcome, {user?.name}! 👋
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            {user?.university?.name || 'University'} • {user?.major || 'Student'} • {user?.year || 'Year N/A'}
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        sx={{
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                        }}
                        onClick={handleForceRefresh}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Refresh'}
                    </Button>
                </Box>
            </Paper>

            {/* Debug Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                    Registered Count: {userEvents.length}
                </Box>
                <Button variant="contained" size="small" onClick={handleForceRefresh} disabled={loading}>
                    Update List
                </Button>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                    All Events Count: {events.length}
                </Box>
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                                <GroupsIcon />
                            </Avatar>
                            <Typography variant="h4" color="primary" fontWeight="bold">
                                {userClubs.length}
                            </Typography>
                            <Typography color="text.secondary">
                                My Clubs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                                <EventIcon />
                            </Avatar>
                            <Typography variant="h4" color="secondary" fontWeight="bold">
                                {userEvents.length}
                            </Typography>
                            <Typography color="text.secondary">
                                Registered Events
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                                <GroupsIcon />
                            </Avatar>
                            <Typography variant="h4" color="success.main" fontWeight="bold">
                                {clubs.length}
                            </Typography>
                            <Typography color="text.secondary">
                                Available Clubs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                                <EventIcon />
                            </Avatar>
                            <Typography variant="h4" color="info.main" fontWeight="bold">
                                {events.length}
                            </Typography>
                            <Typography color="text.secondary">
                                Available Events
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Navigation Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                    <Tab icon={<GroupsIcon />} label="My Clubs" />
                    <Tab icon={<GroupsIcon />} label="All Clubs" />
                    <Tab icon={<EventIcon />} label="Events" />
                    <Tab icon={<EventIcon />} label="Registered Events" />
                    <Tab icon={<GroupsIcon />} label="Team Hub" />
                    <Tab icon={<PersonAddIcon />} label="Profile" />
                </Tabs>
            </Box>

            {/* My Clubs Tab */}
            {tabValue === 0 && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        📚 My Clubs ({userClubs.length})
                    </Typography>
                    {renderClubs(userClubs)}
                </Box>
            )}

            {/* All Clubs Tab */}
            {tabValue === 1 && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        All Clubs ({clubs.length})
                    </Typography>
                    {renderClubs(clubs)}
                </Box>
            )}

            {/* All Events Tab */}
            {tabValue === 2 && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        All Events ({events.length})
                    </Typography>
                    {renderEvents(events)}
                </Box>
            )}

            {/* Registered Events Tab */}
            {tabValue === 3 && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        📅 My Registered Events ({userEvents.length})
                    </Typography>
                    {userEvents.length === 0 ? (
                        <Box textAlign="center" py={4}>
                            <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No registered events yet
                            </Typography>
                            <Typography color="text.secondary">
                                Register for events to see them here
                            </Typography>
                        </Box>
                    ) : (
                        renderEvents(userEvents)
                    )}
                </Box>
            )}

            {/* Team Recruitment Hub Tab */}
            {tabValue === 4 && (
                <TeamRecruitmentHub />
            )}

            {/* My Profile Tab */}
            {tabValue === 5 && (
                <EnhancedProfile />
            )}
        </Container>
    );
};

export default StudentDashboard;
