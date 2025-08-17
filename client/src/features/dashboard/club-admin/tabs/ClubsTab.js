import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Avatar,
    IconButton,
    Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from '@mui/icons-material/Groups';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ClubsTab = ({
    myClubs,
    onAddClub,
    onEditClub,
    onDeleteClub,
    onViewMembers
}) => {
    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">My Clubs</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAddClub}
                >
                    Create New Club
                </Button>
            </Box>

            <Grid container spacing={3}>
                {myClubs.length === 0 ? (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <GroupsIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    No clubs found
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Create your first club to get started
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={onAddClub}
                                >
                                    Create New Club
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (
                    myClubs.map((club) => (
                        <Grid item xs={12} md={6} lg={4} key={club._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                            {club.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box flexGrow={1}>
                                            <Typography variant="h6" noWrap>
                                                {club.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {club.category}
                                            </Typography>
                                        </Box>
                                        {club.isPrivate && (
                                            <Chip label="Private" size="small" color="secondary" />
                                        )}
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {club.description?.length > 100
                                            ? `${club.description.substring(0, 100)}...`
                                            : club.description}
                                    </Typography>

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="text.secondary">
                                            <GroupsIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                            {club.members?.length || 0} members
                                            {club.maxMembers && ` / ${club.maxMembers}`}
                                        </Typography>
                                        {club.establishedYear && (
                                            <Typography variant="body2" color="text.secondary">
                                                Est. {club.establishedYear}
                                            </Typography>
                                        )}
                                    </Box>

                                    {club.tags && club.tags.length > 0 && (
                                        <Box mt={1}>
                                            {club.tags.slice(0, 3).map((tag) => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    size="small"
                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                />
                                            ))}
                                            {club.tags.length > 3 && (
                                                <Chip
                                                    label={`+${club.tags.length - 3} more`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                    )}
                                </CardContent>

                                <CardActions>
                                    <Tooltip title="View Members">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                console.log('View Members button clicked for club:', club);
                                                onViewMembers(club);
                                            }}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit Club">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                console.log('Edit Club button clicked for club:', club);
                                                onEditClub(club);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Club">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => {
                                                console.log('Delete Club button clicked for club ID:', club._id);
                                                onDeleteClub(club._id);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
};

export default ClubsTab;
