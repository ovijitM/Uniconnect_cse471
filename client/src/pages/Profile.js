import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Avatar,
  Grid,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useAuth } from '../features/auth/context/AuthContext';
import api from '../config/api';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [universities, setUniversities] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    university: user?.university?._id || user?.university || '',
    major: user?.major || '',
    year: user?.year || '',
    bio: user?.bio || '',
    interests: user?.interests || []
  });
  const [newInterest, setNewInterest] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const yearOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await api.get('/api/universities');
      setUniversities(response.data.universities || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
      setUniversities([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setMessage(result.error);
    }

    setLoading(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form data when starting to edit
      setFormData({
        name: user?.name || '',
        university: user?.university?._id || user?.university || '',
        major: user?.major || '',
        year: user?.year || '',
        bio: user?.bio || '',
        interests: user?.interests || []
      });
    }
    setMessage('');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%'
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography component="h1" variant="h4" fontWeight="bold">
              My Profile
            </Typography>
            <Button
              onClick={handleEditToggle}
              startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
              variant={isEditing ? "contained" : "outlined"}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </Box>

          {message && (
            <Alert
              severity={message.includes('success') ? 'success' : 'error'}
              sx={{ width: '100%', mb: 3 }}
            >
              {message}
            </Alert>
          )}

          <Grid container spacing={4}>
            {/* Profile Avatar and Basic Info */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '3rem',
                    bgcolor: 'primary.main',
                    mb: 2
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {user?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.university?.name || user?.university || 'No university set'}
                </Typography>
                {user?.major && (
                  <Typography variant="body2" color="text.secondary">
                    {user.major} • {user?.year || 'Year not set'}
                  </Typography>
                )}
                <Chip
                  label={user?.role || 'Student'}
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>

            {/* Profile Form */}
            <Grid item xs={12} md={8}>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
                {isEditing ? (
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>University</InputLabel>
                    <Select
                      name="university"
                      value={formData.university}
                      label="University"
                      onChange={handleChange}
                    >
                      {universities.map((university) => (
                        <MenuItem key={university._id} value={university._id}>
                          {university.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    margin="normal"
                    fullWidth
                    label="University"
                    value={user?.university?.name || 'No university set'}
                    disabled
                  />
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Major/Field of Study"
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      select
                      label="Academic Year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      {yearOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                <TextField
                  margin="normal"
                  fullWidth
                  multiline
                  rows={4}
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  helperText="Maximum 500 characters"
                />

                {/* Interests Section */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Interests
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {formData.interests.map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        onDelete={isEditing ? () => handleRemoveInterest(interest) : undefined}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  {isEditing && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <TextField
                        size="small"
                        placeholder="Add an interest"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                      />
                      <Button onClick={handleAddInterest} variant="outlined" size="small">
                        Add
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* Joined Clubs Section */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsIcon color="primary" />
                    Joined Clubs ({user?.clubMemberships?.length || 0})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {user?.clubMemberships?.length > 0 ? (
                      user.clubMemberships.map((membership, index) => (
                        <Chip
                          key={index}
                          label={`${membership.club?.name || 'Unknown Club'} (${membership.role || 'Member'})`}
                          color="secondary"
                          variant="outlined"
                          size="small"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No clubs joined yet
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Attended Events Section */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon color="primary" />
                    Attended Events ({user?.eventsAttended?.length || 0})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {user?.eventsAttended?.length > 0 ? (
                      user.eventsAttended.slice(0, 10).map((attendance, index) => (
                        <Chip
                          key={index}
                          label={`${attendance.event?.title || 'Unknown Event'}`}
                          color="info"
                          variant="outlined"
                          size="small"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No events attended yet
                      </Typography>
                    )}
                  </Box>
                  {user?.eventsAttended?.length > 10 && (
                    <Typography variant="body2" color="text.secondary">
                      And {user.eventsAttended.length - 10} more events...
                    </Typography>
                  )}
                </Box>

                {isEditing && (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3 }}
                    disabled={loading}
                    startIcon={<SaveIcon />}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
