import React from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import AdminDashboard from '../admin/AdminDashboard';
import ClubAdminDashboard from '../club-admin/ClubAdminDashboard';
import StudentDashboard from '../student/StudentDashboard';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

/**
 * Unified Dashboard Router Component
 * Routes users to appropriate dashboard based on their role
 */
const UnifiedDashboard = () => {
    const { user, loading } = useAuth();

    // Show loading state while authentication is being checked
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{
                py: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh'
            }}>
                <Box textAlign="center">
                    <CircularProgress size={60} />
                    <Typography variant="h4" sx={{ mt: 2 }}>
                        Loading Dashboard...
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Show error if no user is authenticated
    if (!user) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box textAlign="center">
                    <Typography variant="h4" color="error" gutterBottom>
                        Access Denied
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Please log in to access your dashboard.
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Route to appropriate dashboard based on user role
    switch (user.role) {
        case 'Administrator':
            return <AdminDashboard />;

        case 'Club Admin':
            return <ClubAdminDashboard />;

        case 'Student':
        default:
            return <StudentDashboard />;
    }
};

export default UnifiedDashboard;
