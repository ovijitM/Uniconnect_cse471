import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../../../config/api';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    TextField,
    Grid,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    Alert,
    Badge
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    School as SchoolIcon,
    Work as WorkIcon,
    EmojiEvents as TrophyIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../../auth/context/AuthContext';
import axios from 'axios';

const EnhancedProfile = () => {
    const { user, updateProfile, refreshUser, token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [universities, setUniversities] = useState([]);
    const [profileStats, setProfileStats] = useState({
        clubsJoined: 0,
        eventsAttended: 0,
        teamApplications: 0,
        achievements: 0
    });

    // Profile form data
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        university: user?.university?._id || user?.university || '',
        major: user?.major || '',
        graduationYear: user?.graduationYear || new Date().getFullYear(),
        bio: user?.bio || '',
        skills: user?.skills || [],
        interests: user?.interests || [],
        socialLinks: user?.socialLinks || {
            linkedin: '',
            github: '',
            portfolio: ''
        },
        contactInfo: user?.contactInfo || {
            phone: '',
            alternateEmail: ''
        },
        academicInfo: user?.academicInfo || {
            cgpa: '',
            department: '',
            year: ''
        }
    });

    // Skill and interest management
    const [skillDialog, setSkillDialog] = useState(false);
    const [interestDialog, setInterestDialog] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [newInterest, setNewInterest] = useState('');

    const predefinedSkills = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'MongoDB',
        'SQL', 'Design', 'UI/UX', 'Marketing', 'Project Management',
        'Data Analysis', 'Machine Learning', 'Mobile Development',
        'Leadership', 'Communication', 'Problem Solving'
    ];

    const predefinedInterests = [
        'Web Development', 'Mobile Apps', 'Data Science', 'AI/ML',
        'Cybersecurity', 'Game Development', 'IoT', 'Blockchain',
        'Photography', 'Music', 'Sports', 'Entrepreneurship',
        'Volunteering', 'Research', 'Public Speaking'
    ];

    const fetchUniversities = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/universities`);
            setUniversities(response.data.universities || []);
        } catch (error) {
            console.error('Error fetching universities:', error);
        }
    };

    const fetchProfileStats = useCallback(async () => {
        try {
            if (!token) return;

            const [clubsRes, eventsRes, applicationsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/users/profile/clubs`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: { clubs: [] } })),

                axios.get(`${API_BASE_URL}/users/profile/events`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: { events: [] } })),

                axios.get(`${API_BASE_URL}/team-recruitment/user/applications`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: { applications: [] } }))
            ]);

            setProfileStats({
                clubsJoined: clubsRes.data.clubs?.length || 0,
                eventsAttended: eventsRes.data.events?.length || 0,
                teamApplications: applicationsRes.data.applications?.length || 0,
                achievements: user?.achievements?.length || 0
            });

        } catch (error) {
            console.error('Error fetching profile stats:', error);
        }
    }, [token, user]);

    useEffect(() => {
        fetchUniversities();
        fetchProfileStats();
    }, [token, fetchProfileStats]); const handleSave = async () => {
        try {
            setLoading(true);
            setMessage('');

            // Validate required fields
            if (!formData.name.trim() || !formData.email.trim() || !formData.university) {
                setMessage('Please fill in all required fields');
                return;
            }

            const response = await updateProfile(formData);

            if (response.success) {
                setMessage('Profile updated successfully!');
                setIsEditing(false);
                await refreshUser();
            } else {
                setMessage(response.error || 'Failed to update profile');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            university: user?.university?._id || user?.university || '',
            major: user?.major || '',
            graduationYear: user?.graduationYear || new Date().getFullYear(),
            bio: user?.bio || '',
            skills: user?.skills || [],
            interests: user?.interests || [],
            socialLinks: user?.socialLinks || {
                linkedin: '',
                github: '',
                portfolio: ''
            },
            contactInfo: user?.contactInfo || {
                phone: '',
                alternateEmail: ''
            },
            academicInfo: user?.academicInfo || {
                cgpa: '',
                department: '',
                year: ''
            }
        });
        setIsEditing(false);
        setMessage('');
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, newSkill.trim()]
            });
        }
        setNewSkill('');
        setSkillDialog(false);
    };

    const removeSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const addInterest = () => {
        if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
            setFormData({
                ...formData,
                interests: [...formData.interests, newInterest.trim()]
            });
        }
        setNewInterest('');
        setInterestDialog(false);
    };

    const removeInterest = (interestToRemove) => {
        setFormData({
            ...formData,
            interests: formData.interests.filter(interest => interest !== interestToRemove)
        });
    };

    const getProfileCompletion = () => {
        const fields = [
            formData.name,
            formData.email,
            formData.university,
            formData.major,
            formData.bio,
            formData.skills.length > 0,
            formData.interests.length > 0,
            formData.socialLinks.linkedin || formData.socialLinks.github,
            formData.academicInfo.department
        ];

        const completedFields = fields.filter(field => field).length;
        return Math.round((completedFields / fields.length) * 100);
    };

    const completionPercentage = getProfileCompletion();

    return (
        <Box>
            {/* Profile Header */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={3}>
                        <Badge
                            badgeContent={completionPercentage + '%'}
                            color={completionPercentage > 80 ? 'success' : completionPercentage > 60 ? 'warning' : 'error'}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                            <Avatar
                                sx={{ width: 80, height: 80, fontSize: '2rem' }}
                            >
                                {formData.name.charAt(0).toUpperCase()}
                            </Avatar>
                        </Badge>

                        <Box flex={1}>
                            <Typography variant="h4" fontWeight="bold">
                                {formData.name}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                {formData.major}
                                {formData.graduationYear && ` • Class of ${formData.graduationYear}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {universities.find(u => u._id === formData.university)?.name}
                            </Typography>

                            <Box mt={2}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Profile Completion: {completionPercentage}%
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={completionPercentage}
                                    sx={{ width: '200px' }}
                                    color={completionPercentage > 80 ? 'success' : completionPercentage > 60 ? 'warning' : 'error'}
                                />
                            </Box>
                        </Box>

                        <Box>
                            {!isEditing ? (
                                <Button
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <Box display="flex" gap={1}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSave}
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {message && (
                        <Alert
                            severity={message.includes('success') ? 'success' : 'error'}
                            sx={{ mt: 2 }}
                        >
                            {message}
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Profile Stats */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <SchoolIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {profileStats.clubsJoined}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Clubs Joined
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <TrophyIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {profileStats.eventsAttended}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Events Attended
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: 'warning.main' }}>
                                    <WorkIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {profileStats.teamApplications}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Team Applications
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                    <TrophyIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {profileStats.achievements}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Achievements
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                👤 Basic Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Full Name"
                                        fullWidth
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={!isEditing}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={!isEditing}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth disabled={!isEditing}>
                                        <InputLabel>University *</InputLabel>
                                        <Select
                                            value={formData.university}
                                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                            required
                                        >
                                            {universities.map((uni) => (
                                                <MenuItem key={uni._id} value={uni._id}>
                                                    {uni.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Major/Field of Study"
                                        fullWidth
                                        value={formData.major}
                                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Graduation Year"
                                        type="number"
                                        fullWidth
                                        value={formData.graduationYear}
                                        onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                                        disabled={!isEditing}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Bio"
                                        multiline
                                        rows={3}
                                        fullWidth
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="Tell us about yourself..."
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Skills & Interests */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                🎯 Skills & Interests
                            </Typography>

                            <Box mb={3}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        Skills
                                    </Typography>
                                    {isEditing && (
                                        <Button
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={() => setSkillDialog(true)}
                                        >
                                            Add
                                        </Button>
                                    )}
                                </Box>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {formData.skills.map((skill, index) => (
                                        <Chip
                                            key={index}
                                            label={skill}
                                            onDelete={isEditing ? () => removeSkill(skill) : undefined}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                    {formData.skills.length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            No skills added yet
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            <Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        Interests
                                    </Typography>
                                    {isEditing && (
                                        <Button
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={() => setInterestDialog(true)}
                                        >
                                            Add
                                        </Button>
                                    )}
                                </Box>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {formData.interests.map((interest, index) => (
                                        <Chip
                                            key={index}
                                            label={interest}
                                            onDelete={isEditing ? () => removeInterest(interest) : undefined}
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    ))}
                                    {formData.interests.length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            No interests added yet
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Social Links */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                🔗 Social Links
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="LinkedIn URL"
                                        fullWidth
                                        value={formData.socialLinks.linkedin}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                                        })}
                                        disabled={!isEditing}
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="GitHub URL"
                                        fullWidth
                                        value={formData.socialLinks.github}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, github: e.target.value }
                                        })}
                                        disabled={!isEditing}
                                        placeholder="https://github.com/username"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Portfolio URL"
                                        fullWidth
                                        value={formData.socialLinks.portfolio}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, portfolio: e.target.value }
                                        })}
                                        disabled={!isEditing}
                                        placeholder="https://yourportfolio.com"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Academic Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                📚 Academic Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Department"
                                        fullWidth
                                        value={formData.academicInfo.department}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            academicInfo: { ...formData.academicInfo, department: e.target.value }
                                        })}
                                        disabled={!isEditing}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Current Year"
                                        fullWidth
                                        value={formData.academicInfo.year}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            academicInfo: { ...formData.academicInfo, year: e.target.value }
                                        })}
                                        disabled={!isEditing}
                                        placeholder="e.g., 3rd Year"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="CGPA/GPA"
                                        fullWidth
                                        value={formData.academicInfo.cgpa}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            academicInfo: { ...formData.academicInfo, cgpa: e.target.value }
                                        })}
                                        disabled={!isEditing}
                                        placeholder="Optional"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Skill Dialog */}
            <Dialog open={skillDialog} onClose={() => setSkillDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Skill</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Skill"
                        fullWidth
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        sx={{ mt: 1, mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Suggested skills:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {predefinedSkills
                            .filter(skill => !formData.skills.includes(skill))
                            .slice(0, 10)
                            .map((skill) => (
                                <Chip
                                    key={skill}
                                    label={skill}
                                    size="small"
                                    onClick={() => setNewSkill(skill)}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSkillDialog(false)}>Cancel</Button>
                    <Button onClick={addSkill} disabled={!newSkill.trim()}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Interest Dialog */}
            <Dialog open={interestDialog} onClose={() => setInterestDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Interest</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Interest"
                        fullWidth
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        sx={{ mt: 1, mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Suggested interests:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {predefinedInterests
                            .filter(interest => !formData.interests.includes(interest))
                            .slice(0, 10)
                            .map((interest) => (
                                <Chip
                                    key={interest}
                                    label={interest}
                                    size="small"
                                    onClick={() => setNewInterest(interest)}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInterestDialog(false)}>Cancel</Button>
                    <Button onClick={addInterest} disabled={!newInterest.trim()}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EnhancedProfile;
