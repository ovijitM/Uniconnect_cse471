import api from '../../../../config/api';

// Using configured API instance

// Club API functions
export const clubAPI = {
    getMyClubs: async () => {
        const response = await api.get('/clubs/managed', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    createClub: async (clubData) => {
        const response = await api.post('/clubs', clubData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    updateClub: async (clubId, clubData) => {
        const response = await api.put(`/clubs/${clubId}`, clubData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    deleteClub: async (clubId) => {
        const response = await api.delete(`/clubs/${clubId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

// Event API functions
export const eventAPI = {
    getMyEvents: async () => {
        const response = await api.get('/events/managed', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    createEvent: async (eventData) => {
        const response = await api.post('/events', eventData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    updateEvent: async (eventId, eventData) => {
        const response = await api.put(`/events/${eventId}`, eventData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    deleteEvent: async (eventId) => {
        const response = await api.delete(`/events/${eventId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

// Member management API
export const memberAPI = {
    searchUser: async (email) => {
        const response = await api.get(`/users/search?email=${email}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    addMember: async (clubId, userId) => {
        const response = await api.post(`/clubs/${clubId}/members`, 
            { userId }, 
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }
        );
        return response.data;
    },

    removeMember: async (clubId, userId) => {
        const response = await api.delete(`/clubs/${clubId}/members/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    getClubMembers: async (clubId) => {
        const response = await api.get(`/clubs/${clubId}/members`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

// Universities API
export const universitiesAPI = {
    getAll: async () => {
        const response = await api.get('/universities');
        return response.data;
    }
};
