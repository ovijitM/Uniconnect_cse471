import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const StatsCards = ({ stats }) => {
    const statsData = [
        {
            title: 'Total Clubs',
            value: stats.totalClubs,
            icon: GroupsIcon,
            color: '#1976d2'
        },
        {
            title: 'Total Events',
            value: stats.totalEvents,
            icon: EventIcon,
            color: '#388e3c'
        },
        {
            title: 'Total Members',
            value: stats.totalMembers,
            icon: PersonIcon,
            color: '#f57c00'
        },
        {
            title: 'Upcoming Events',
            value: stats.upcomingEvents,
            icon: CalendarTodayIcon,
            color: '#7b1fa2'
        }
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            {statsData.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {stat.title}
                                        </Typography>
                                    </Box>
                                    <IconComponent sx={{ fontSize: 40, color: stat.color }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default StatsCards;
