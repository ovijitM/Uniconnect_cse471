import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    IconButton,
    Avatar,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Badge,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

const AchievementsTab = ({ myClubs, myEvents }) => {
    const [createAchievementOpen, setCreateAchievementOpen] = useState(false);
    const [createBadgeOpen, setCreateBadgeOpen] = useState(false);

    const [newAchievement, setNewAchievement] = useState({
        name: '',
        description: '',
        criteria: '',
        points: 0,
        category: 'engagement'
    });

    const [newBadge, setNewBadge] = useState({
        name: '',
        description: '',
        icon: 'star',
        color: '#FFD700',
        requirements: ''
    });

    // Sample achievements data
    const achievements = [
        {
            id: 1,
            name: 'Club Founder',
            description: 'Created your first club',
            icon: '🏆',
            rarity: 'legendary',
            points: 100,
            unlockedBy: ['John Doe', 'Jane Smith', 'Mike Johnson'],
            category: 'leadership'
        },
        {
            id: 2,
            name: 'Event Master',
            description: 'Organized 10 successful events',
            icon: '🎯',
            rarity: 'epic',
            points: 75,
            unlockedBy: ['Sarah Wilson', 'David Brown'],
            category: 'events'
        },
        {
            id: 3,
            name: 'Community Builder',
            description: 'Reached 100 members across all clubs',
            icon: '🌟',
            rarity: 'rare',
            points: 50,
            unlockedBy: ['Alice Cooper', 'Bob Smith', 'Carol White', 'Dan Green'],
            category: 'growth'
        },
        {
            id: 4,
            name: 'Engagement Champion',
            description: 'Maintain 90%+ attendance for 6 months',
            icon: '💪',
            rarity: 'uncommon',
            points: 30,
            unlockedBy: ['Emma Davis', 'Frank Miller', 'Grace Lee'],
            category: 'engagement'
        }
    ];

    const badges = [
        {
            id: 1,
            name: 'Pioneer',
            description: 'First to achieve something exceptional',
            icon: '🎖️',
            color: '#FF6B35',
            holders: 3,
            category: 'special'
        },
        {
            id: 2,
            name: 'Innovator',
            description: 'Introduced creative solutions',
            icon: '💡',
            color: '#F7931E',
            holders: 7,
            category: 'creativity'
        },
        {
            id: 3,
            name: 'Mentor',
            description: 'Helped other club admins succeed',
            icon: '🎓',
            color: '#4ECDC4',
            holders: 5,
            category: 'leadership'
        },
        {
            id: 4,
            name: 'Collaborator',
            description: 'Successfully organized inter-club events',
            icon: '🤝',
            color: '#45B7D1',
            holders: 12,
            category: 'teamwork'
        }
    ];

    // Sample leaderboard data
    const leaderboard = [
        { name: 'John Doe', points: 485, badges: 8, achievements: 12, clubs: 3 },
        { name: 'Jane Smith', points: 420, badges: 6, achievements: 10, clubs: 2 },
        { name: 'Mike Johnson', points: 380, badges: 5, achievements: 9, clubs: 2 },
        { name: 'Sarah Wilson', points: 340, badges: 4, achievements: 8, clubs: 1 },
        { name: 'David Brown', points: 310, badges: 4, achievements: 7, clubs: 2 }
    ];

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'legendary': return '#FFD700';
            case 'epic': return '#9C27B0';
            case 'rare': return '#2196F3';
            case 'uncommon': return '#4CAF50';
            default: return '#757575';
        }
    };

    const handleCreateAchievement = () => {
        // Implementation for creating achievement
        console.log('Creating achievement:', newAchievement);
        setNewAchievement({
            name: '',
            description: '',
            criteria: '',
            points: 0,
            category: 'engagement'
        });
        setCreateAchievementOpen(false);
    };

    const handleCreateBadge = () => {
        // Implementation for creating badge
        console.log('Creating badge:', newBadge);
        setNewBadge({
            name: '',
            description: '',
            icon: 'star',
            color: '#FFD700',
            requirements: ''
        });
        setCreateBadgeOpen(false);
    };

    const handleAwardBadge = (badgeId, memberId) => {
        // Implementation for awarding badge
        console.log('Awarding badge:', badgeId, 'to member:', memberId);
    };

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Achievement System</Typography>
                <Box display="flex" gap={2}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateAchievementOpen(true)}
                    >
                        Create Achievement
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<WorkspacePremiumIcon />}
                        onClick={() => setCreateBadgeOpen(true)}
                    >
                        Create Badge
                    </Button>
                </Box>
            </Box>

            {/* Achievement Statistics */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <EmojiEventsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {achievements.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Achievements
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <WorkspacePremiumIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {badges.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Available Badges
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {leaderboard.reduce((sum, user) => sum + user.points, 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Points Earned
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <MilitaryTechIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {badges.reduce((sum, badge) => sum + badge.holders, 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Badges Awarded
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Achievements Section */}
                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Available Achievements
                            </Typography>
                            <List>
                                {achievements.map((achievement) => (
                                    <ListItem key={achievement.id}>
                                        <ListItemIcon>
                                            <Avatar
                                                sx={{
                                                    bgcolor: getRarityColor(achievement.rarity),
                                                    width: 48,
                                                    height: 48
                                                }}
                                            >
                                                <span style={{ fontSize: '24px' }}>
                                                    {achievement.icon}
                                                </span>
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {achievement.name}
                                                    </Typography>
                                                    <Chip
                                                        label={achievement.rarity}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: getRarityColor(achievement.rarity),
                                                            color: 'white',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                    <Chip
                                                        label={`${achievement.points} pts`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {achievement.description}
                                                    </Typography>
                                                    <Typography variant="caption" color="primary">
                                                        Unlocked by {achievement.unlockedBy.length} members
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton size="small">
                                                <EditIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Badges Section */}
                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Badge Collection
                            </Typography>
                            <Grid container spacing={2}>
                                {badges.map((badge) => (
                                    <Grid item xs={12} sm={6} key={badge.id}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                borderRadius: 2,
                                                border: `2px solid ${badge.color}20`
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    bgcolor: badge.color,
                                                    width: 60,
                                                    height: 60,
                                                    mx: 'auto',
                                                    mb: 1
                                                }}
                                            >
                                                <span style={{ fontSize: '30px' }}>
                                                    {badge.icon}
                                                </span>
                                            </Avatar>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {badge.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {badge.description}
                                            </Typography>
                                            <Chip
                                                label={`${badge.holders} holders`}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                            <Box display="flex" justifyContent="center" gap={1} mt={1}>
                                                <IconButton size="small" color="primary">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Leaderboard */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Achievement Leaderboard
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Rank</TableCell>
                                            <TableCell>Member</TableCell>
                                            <TableCell align="right">Points</TableCell>
                                            <TableCell align="right">Badges</TableCell>
                                            <TableCell align="right">Achievements</TableCell>
                                            <TableCell align="right">Clubs</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {leaderboard.map((member, index) => (
                                            <TableRow key={member.name}>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        {index < 3 ? (
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                                                                    width: 32,
                                                                    height: 32
                                                                }}
                                                            >
                                                                {index + 1}
                                                            </Avatar>
                                                        ) : (
                                                            <Chip label={`#${index + 1}`} size="small" />
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Avatar>{member.name.charAt(0)}</Avatar>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {member.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        label={`${member.points} pts`}
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Badge badgeContent={member.badges} color="secondary">
                                                        <WorkspacePremiumIcon />
                                                    </Badge>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Badge badgeContent={member.achievements} color="primary">
                                                        <EmojiEventsIcon />
                                                    </Badge>
                                                </TableCell>
                                                <TableCell align="right">{member.clubs}</TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<WorkspacePremiumIcon />}
                                                        onClick={() => handleAwardBadge('custom', member.name)}
                                                    >
                                                        Award Badge
                                                    </Button>
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

            {/* Create Achievement Dialog */}
            <Dialog open={createAchievementOpen} onClose={() => setCreateAchievementOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Achievement</DialogTitle>
                <DialogContent>
                    <Box py={2} display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Achievement Name"
                            fullWidth
                            value={newAchievement.name}
                            onChange={(e) => setNewAchievement(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={2}
                            value={newAchievement.description}
                            onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                        />
                        <TextField
                            label="Criteria"
                            fullWidth
                            multiline
                            rows={2}
                            value={newAchievement.criteria}
                            onChange={(e) => setNewAchievement(prev => ({ ...prev, criteria: e.target.value }))}
                        />
                        <TextField
                            label="Points"
                            type="number"
                            fullWidth
                            value={newAchievement.points}
                            onChange={(e) => setNewAchievement(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={newAchievement.category}
                                label="Category"
                                onChange={(e) => setNewAchievement(prev => ({ ...prev, category: e.target.value }))}
                            >
                                <MenuItem value="engagement">Engagement</MenuItem>
                                <MenuItem value="leadership">Leadership</MenuItem>
                                <MenuItem value="events">Events</MenuItem>
                                <MenuItem value="growth">Growth</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateAchievementOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateAchievement}
                        disabled={!newAchievement.name || !newAchievement.description}
                    >
                        Create Achievement
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Badge Dialog */}
            <Dialog open={createBadgeOpen} onClose={() => setCreateBadgeOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Badge</DialogTitle>
                <DialogContent>
                    <Box py={2} display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Badge Name"
                            fullWidth
                            value={newBadge.name}
                            onChange={(e) => setNewBadge(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={2}
                            value={newBadge.description}
                            onChange={(e) => setNewBadge(prev => ({ ...prev, description: e.target.value }))}
                        />
                        <TextField
                            label="Requirements"
                            fullWidth
                            multiline
                            rows={2}
                            value={newBadge.requirements}
                            onChange={(e) => setNewBadge(prev => ({ ...prev, requirements: e.target.value }))}
                        />
                        <TextField
                            label="Icon (Emoji)"
                            fullWidth
                            value={newBadge.icon}
                            onChange={(e) => setNewBadge(prev => ({ ...prev, icon: e.target.value }))}
                        />
                        <TextField
                            label="Color"
                            type="color"
                            fullWidth
                            value={newBadge.color}
                            onChange={(e) => setNewBadge(prev => ({ ...prev, color: e.target.value }))}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateBadgeOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateBadge}
                        disabled={!newBadge.name || !newBadge.description}
                    >
                        Create Badge
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AchievementsTab;
