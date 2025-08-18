import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    LinearProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const AnalyticsTab = () => {
    // State management
    const [dateRange, setDateRange] = useState('last30days');
    const [viewType, setViewType] = useState('overview');
    const [timeRange, setTimeRange] = useState('month');

    // Sample data - replace with real data from props or API
    const myClubs = [
        { _id: '1', name: 'Computer Science Club', members: [1, 2, 3, 4, 5] },
        { _id: '2', name: 'Photography Club', members: [1, 2, 3] },
        { _id: '3', name: 'Debate Society', members: [1, 2, 3, 4] }
    ];

    const myEvents = [
        { _id: '1', club: '1', name: 'Workshop 1' },
        { _id: '2', club: '1', name: 'Workshop 2' },
        { _id: '3', club: '2', name: 'Photo Contest' }
    ];

    // Sample data for charts
    const memberGrowthData = [
        { month: 'Jan', members: 65, events: 4 },
        { month: 'Feb', members: 78, events: 6 },
        { month: 'Mar', members: 82, events: 5 },
        { month: 'Apr', members: 90, events: 8 },
        { month: 'May', members: 95, events: 7 },
        { month: 'Jun', members: 102, events: 9 }
    ];

    const eventAnalyticsData = [
        { name: 'Workshops', value: 40, color: '#8884d8' },
        { name: 'Seminars', value: 30, color: '#82ca9d' },
        { name: 'Social Events', value: 20, color: '#ffc658' },
        { name: 'Competitions', value: 10, color: '#ff7c7c' }
    ];

    const clubPerformanceData = myClubs.map(club => ({
        name: club.name.substring(0, 15) + (club.name.length > 15 ? '...' : ''),
        members: club.members?.length || 0,
        events: myEvents.filter(event => event.club === club._id).length,
        engagement: Math.floor(Math.random() * 100)
    }));

    const topPerformingClubs = clubPerformanceData
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 5);

    const handleExportData = () => {
        // Implementation for data export
        const data = {
            memberGrowth: memberGrowthData,
            eventAnalytics: eventAnalyticsData,
            clubPerformance: clubPerformanceData,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `club_analytics_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Analytics & Reports</Typography>
                <Box display="flex" gap={2}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Time Range</InputLabel>
                        <Select
                            value={timeRange}
                            label="Time Range"
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <MenuItem value="1month">1 Month</MenuItem>
                            <MenuItem value="3months">3 Months</MenuItem>
                            <MenuItem value="6months">6 Months</MenuItem>
                            <MenuItem value="1year">1 Year</MenuItem>
                        </Select>
                    </FormControl>
                    <Tooltip title="Refresh Data">
                        <IconButton onClick={() => window.location.reload()}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleExportData}
                    >
                        Export Data
                    </Button>
                </Box>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {myClubs.reduce((sum, club) => sum + (club.members?.length || 0), 0)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Members
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <TrendingUpIcon fontSize="small" color="success" />
                                        <Typography variant="caption" color="success.main" ml={0.5}>
                                            +12% this month
                                        </Typography>
                                    </Box>
                                </Box>
                                <GroupsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {myEvents.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Events
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <TrendingUpIcon fontSize="small" color="success" />
                                        <Typography variant="caption" color="success.main" ml={0.5}>
                                            +8% this month
                                        </Typography>
                                    </Box>
                                </Box>
                                <EventIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        87%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Avg Attendance
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={87}
                                            sx={{ width: 60, mr: 1 }}
                                        />
                                        <Typography variant="caption">
                                            +3%
                                        </Typography>
                                    </Box>
                                </Box>
                                <AnalyticsIcon sx={{ fontSize: 40, color: 'success.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        92%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Engagement Rate
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={92}
                                            sx={{ width: 60, mr: 1 }}
                                        />
                                        <Typography variant="caption">
                                            +5%
                                        </Typography>
                                    </Box>
                                </Box>
                                <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
                {/* Member Growth Chart */}
                <Grid item xs={12} lg={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Member Growth & Event Trends
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={memberGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="members"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        name="Members"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="events"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                        name="Events"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Event Distribution Chart */}
                <Grid item xs={12} lg={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Event Distribution
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={eventAnalyticsData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {eventAnalyticsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Club Performance Chart */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Club Performance Overview
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={clubPerformanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Bar dataKey="members" fill="#8884d8" name="Members" />
                                    <Bar dataKey="events" fill="#82ca9d" name="Events" />
                                    <Bar dataKey="engagement" fill="#ffc658" name="Engagement %" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top Performing Clubs */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Top Performing Clubs
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Rank</TableCell>
                                            <TableCell>Club Name</TableCell>
                                            <TableCell align="right">Members</TableCell>
                                            <TableCell align="right">Events</TableCell>
                                            <TableCell align="right">Engagement</TableCell>
                                            <TableCell align="right">Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {topPerformingClubs.map((club, index) => (
                                            <TableRow key={club.name}>
                                                <TableCell>
                                                    <Chip
                                                        label={`#${index + 1}`}
                                                        color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{club.name}</TableCell>
                                                <TableCell align="right">{club.members}</TableCell>
                                                <TableCell align="right">{club.events}</TableCell>
                                                <TableCell align="right">
                                                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={club.engagement}
                                                            sx={{ width: 60, mr: 1 }}
                                                        />
                                                        {club.engagement}%
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        label={club.engagement > 80 ? 'Excellent' : club.engagement > 60 ? 'Good' : 'Needs Attention'}
                                                        color={club.engagement > 80 ? 'success' : club.engagement > 60 ? 'primary' : 'warning'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsTab;
