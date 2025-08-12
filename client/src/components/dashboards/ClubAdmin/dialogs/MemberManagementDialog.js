import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Avatar,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const MemberManagementDialog = ({
    open,
    onClose,
    selectedClub,
    clubMembers,
    searchEmail,
    setSearchEmail,
    searchUser,
    searchLoading,
    onSearchUser,
    onAddMember,
    onRemoveMember
}) => {
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearchUser();
        }
    };

    // Safety check for clubMembers
    const safeClubMembers = Array.isArray(clubMembers) ? clubMembers : [];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        Manage Members - {selectedClub?.name}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                {/* Add Member Section */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                        Add New Member
                    </Typography>
                    <Box display="flex" gap={2} alignItems="flex-start">
                        <TextField
                            label="Search by Email"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                            fullWidth
                            placeholder="Enter user email..."
                        />
                        <Button
                            variant="contained"
                            onClick={onSearchUser}
                            disabled={searchLoading || !searchEmail.trim()}
                            startIcon={searchLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                            sx={{ minWidth: 120 }}
                        >
                            {searchLoading ? 'Searching...' : 'Search'}
                        </Button>
                    </Box>

                    {searchUser && (
                        <Box mt={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" alignItems="center">
                                    <Avatar sx={{ mr: 2 }}>
                                        {(searchUser.name || searchUser.email || 'U').charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1">
                                            {searchUser.name || 'Unknown User'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {searchUser.email || 'No email'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {searchUser.university?.name}
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
                        </Box>
                    )}
                </Box>

                {/* Current Members Section */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Current Members ({safeClubMembers.length})
                </Typography>

                {safeClubMembers.length === 0 ? (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        No members found. Add members using the search above.
                    </Alert>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Member</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Joined</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {safeClubMembers && Array.isArray(safeClubMembers) && safeClubMembers.map((member, index) => {
                                    // Safety check for member data
                                    if (!member) {
                                        console.warn('Invalid member data at index:', index);
                                        return null;
                                    }

                                    const memberName = member.user?.name || member.name || 'Unknown User';
                                    const memberEmail = member.user?.email || member.email || 'No email';
                                    const memberRole = member.role || 'Member';
                                    const memberId = member.user?._id || member._id;

                                    return (
                                        <TableRow key={memberId || `member-${index}`}>
                                            <TableCell>
                                                <Box display="flex" alignItems="center">
                                                    <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                                                        {(memberName || 'U').charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2">
                                                            {memberName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {member.user?.university?.name || member.university?.name || 'No university'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{memberEmail}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={memberRole === 'admin' ? 'Admin' : 'Member'}
                                                    color={memberRole === 'admin' ? 'primary' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(member.joinedAt || member.joinedDate || Date.now()).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell align="right">
                                                {memberRole !== 'admin' && memberId && (
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => onRemoveMember(memberId)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MemberManagementDialog;
