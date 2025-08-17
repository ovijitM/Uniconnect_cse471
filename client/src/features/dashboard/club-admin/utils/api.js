import axios from 'axios';

// API endpoints
const API_BASE_URL = 'http://localhost:5001/api';

// Club API functions
export const clubAPI = {
    getMyClubs: async () => {
        const response = await axios.get(`${API_BASE_URL}/clubs/managed`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    createClub: async (clubData) => {
        const response = await axios.post(`${API_BASE_URL}/clubs`, clubData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    updateClub: async (clubId, clubData) => {
        const response = await axios.put(`${API_BASE_URL}/clubs/${clubId}`, clubData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    deleteClub: async (clubId) => {
        const response = await axios.delete(`${API_BASE_URL}/clubs/${clubId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

// Event API functions
export const eventAPI = {
    getMyEvents: async () => {
        const response = await axios.get(`${API_BASE_URL}/events/managed`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    createEvent: async (eventData) => {
        const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    updateEvent: async (eventId, eventData) => {
        const response = await axios.put(`${API_BASE_URL}/events/${eventId}`, eventData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    deleteEvent: async (eventId) => {
        const response = await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

// Member management API
export const memberAPI = {
    searchUser: async (email) => {
        const response = await axios.get(`${API_BASE_URL}/users/search?email=${email}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    addMember: async (clubId, userId) => {
        const response = await axios.post(`${API_BASE_URL}/clubs/${clubId}/members`, {
            userId
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    removeMember: async (clubId, userId) => {
        const response = await axios.delete(`${API_BASE_URL}/clubs/${clubId}/members/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    getClubMembers: async (clubId) => {
        const response = await axios.get(`${API_BASE_URL}/clubs/${clubId}/members`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

// Universities API
export const universitiesAPI = {
    getAll: async () => {
        const response = await axios.get(`${API_BASE_URL}/universities`);
        return response.data;
    }
};
