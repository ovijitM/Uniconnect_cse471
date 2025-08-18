import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Chip,
    IconButton,
    Button,
    TextField,
    Alert,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from '@mui/icons-material/Groups';

const MembersTab = ({
    myClubs,
    selectedClub,
    onClubSelect,
    clubMembers,
    searchEmail,
    setSearchEmail,
    searchUser,
    searchLoading,
    onSearchUser,
    onAddMember,
    onRemoveMember,
    loading
}) => {
    const [localSearchEmail, setLocalSearchEmail] = useState('');

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            setSearchEmail(localSearchEmail);
            onSearchUser();
        }
    };

    const handleSearchClick = () => {
        setSearchEmail(localSearchEmail);
        onSearchUser();
    };

    if (myClubs.length === 0) {
        return (
            <Box>
                <Typography variant="h5" sx={{ mb: 2 }}>Member Management</Typography>
                <Alert severity="info">
                    You don't have any clubs yet. Create a club first to manage members.
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>Member Management</Typography>

            {/* Club Selection */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Club</InputLabel>
                        <Select
                            value={selectedClub?._id || ''}
                            label="Select Club"
                            onChange={(e) => {
                                const club = myClubs.find(c => c._id === e.target.value);
                                onClubSelect(club);
                            }}
                        >
                            {myClubs.map((club) => (
                                <MenuItem key={club._id} value={club._id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <GroupsIcon sx={{ mr: 1 }} />
                                        {club.name} ({club.members?.length || 0} members)
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {selectedClub && (
                <>
                    {/* Add New Member Section */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Add New Member</Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Search by Email"
                                    value={localSearchEmail}
                                    onChange={(e) => setLocalSearchEmail(e.target.value)}
                                    onKeyPress={handleSearchKeyPress}
                                    placeholder="Enter user email to add as member"
                                />
                                <IconButton
                                    onClick={handleSearchClick}
                                    disabled={!localSearchEmail.trim() || searchLoading}
                                >
                                    {searchLoading ? <CircularProgress size={24} /> : <SearchIcon />}
                                </IconButton>
                            </Box>

                            {searchUser && (
                                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ mr: 2 }}>
                                                {searchUser.name?.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1">{searchUser.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {searchUser.email}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {searchUser.major} • {searchUser.year}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            startIcon={<PersonAddIcon />}
                                            onClick={onAddMember}
                                            size="small"
                                        >
                                            Add Member
                                        </Button>
                                    </Box>
                                </Card>
                            )}
                        </CardContent>
                    </Card>

                    {/* Members List */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {selectedClub.name} Members ({clubMembers.length})
                            </Typography>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : clubMembers.length === 0 ? (
                                <Alert severity="info">
                                    This club has no members yet.
                                </Alert>
                            ) : (
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Member</TableCell>
                                                <TableCell>Role</TableCell>
                                                <TableCell>Joined Date</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {clubMembers.map((member) => (
                                                <TableRow key={member._id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar sx={{ mr: 2 }}>
                                                                {member.user?.name?.charAt(0)}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="subtitle2">
                                                                    {member.user?.name}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {member.user?.email}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={member.role}
                                                            color={member.role === 'President' ? 'primary' : 'default'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(member.joinedDate).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {member.role !== 'President' && (
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => onRemoveMember(member.user._id)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </Box>
    );
};

export default MembersTab;
