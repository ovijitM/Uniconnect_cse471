// Form validation utilities
export const validateClubForm = (clubFormData) => {
    const errors = {};

    if (!clubFormData.name.trim()) errors.name = 'Club name is required';
    if (!clubFormData.description.trim()) errors.description = 'Description is required';
    if (!clubFormData.category) errors.category = 'Category is required';
    if (!clubFormData.university) errors.university = 'University is required';
    if (clubFormData.maxMembers && clubFormData.maxMembers < 1) {
        errors.maxMembers = 'Max members must be at least 1';
    }

    return errors;
};

export const validateEventForm = (eventFormData) => {
    const errors = {};

    if (!eventFormData.title.trim()) errors.title = 'Event title is required';
    if (!eventFormData.description.trim()) errors.description = 'Description is required';
    if (!eventFormData.date) errors.date = 'Date is required';
    if (!eventFormData.time) errors.time = 'Time is required';
    if (!eventFormData.location.trim() && !eventFormData.isVirtual) {
        errors.location = 'Location is required for in-person events';
    }
    if (eventFormData.isVirtual && !eventFormData.virtualLink.trim()) {
        errors.virtualLink = 'Virtual link is required for virtual events';
    }
    if (eventFormData.maxAttendees && eventFormData.maxAttendees < 1) {
        errors.maxAttendees = 'Max attendees must be at least 1';
    }

    return errors;
};

// Form data utilities
export const resetClubForm = () => ({
    name: '',
    description: '',
    category: '',
    university: '',
    isPrivate: false,
    maxMembers: '',
    rules: '',
    socialLinks: {
        website: '',
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
    },
    contactEmail: '',
    establishedYear: '',
    tags: []
});

export const resetEventForm = () => ({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    maxAttendees: '',
    isVirtual: false,
    virtualLink: '',
    category: '',
    isPrivate: false,
    requirements: '',
    tags: [],
    registrationDeadline: '',
    price: ''
});
