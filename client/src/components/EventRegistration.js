import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';
import './EventRegistration.css';

const EventRegistration = ({ eventId, onClose, onSuccess }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        university: '',
        studentId: '',
        major: '',
        year: '',
        dietaryRestrictions: '',
        emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
        },
        additionalInfo: ''
    });

    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/events/${eventId}/registration-data`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData(response.data.registrationData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    }, [eventId, token]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const { name, email, phone, university } = formData;
        
        if (!name.trim()) {
            setError('Name is required');
            return false;
        }
        
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        
        if (!phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        
        if (!university.trim()) {
            setError('University is required');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setLoading(true);
            await axios.post(`${API_BASE_URL}/events/${eventId}/register`, {
                registrationData: formData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            onSuccess && onSuccess();
            onClose && onClose();
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.name) {
        return (
            <div className="registration-modal">
                <div className="registration-content">
                    <div className="loading-spinner">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="registration-modal">
            <div className="registration-content">
                <div className="registration-header">
                    <h2>Event Registration</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-section">
                        <h3>Personal Information</h3>
                        
                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h3>Academic Information</h3>
                        
                        <div className="form-group">
                            <label htmlFor="university">University *</label>
                            <input
                                type="text"
                                id="university"
                                name="university"
                                value={formData.university}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="studentId">Student ID</label>
                                <input
                                    type="text"
                                    id="studentId"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleInputChange}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="major">Major</label>
                                <input
                                    type="text"
                                    id="major"
                                    name="major"
                                    value={formData.major}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="year">Year of Study</label>
                            <select
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Year</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                                <option value="Graduate">Graduate</option>
                                <option value="PhD">PhD</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h3>Additional Information</h3>
                        
                        <div className="form-group">
                            <label htmlFor="dietaryRestrictions">Dietary Restrictions</label>
                            <input
                                type="text"
                                id="dietaryRestrictions"
                                name="dietaryRestrictions"
                                value={formData.dietaryRestrictions}
                                onChange={handleInputChange}
                                placeholder="e.g., Vegetarian, Vegan, Allergies"
                            />
                        </div>
                        
                        <div className="emergency-contact">
                            <h4>Emergency Contact</h4>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="emergencyContact.name">Contact Name</label>
                                    <input
                                        type="text"
                                        id="emergencyContact.name"
                                        name="emergencyContact.name"
                                        value={formData.emergencyContact.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="emergencyContact.phone">Contact Phone</label>
                                    <input
                                        type="tel"
                                        id="emergencyContact.phone"
                                        name="emergencyContact.phone"
                                        value={formData.emergencyContact.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="emergencyContact.relationship">Relationship</label>
                                <input
                                    type="text"
                                    id="emergencyContact.relationship"
                                    name="emergencyContact.relationship"
                                    value={formData.emergencyContact.relationship}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Parent, Sibling, Friend"
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="additionalInfo">Additional Information</label>
                            <textarea
                                id="additionalInfo"
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleInputChange}
                                rows="3"
                                maxLength="500"
                                placeholder="Any additional information you'd like to share..."
                            />
                            <small>{formData.additionalInfo.length}/500 characters</small>
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn-register">
                            {loading ? 'Registering...' : 'Register for Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventRegistration;