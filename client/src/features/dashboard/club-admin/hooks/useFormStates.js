import { useState } from 'react';

// Custom hook for managing form data and states
export const useFormStates = () => {
    // Club form data
    const [clubFormData, setClubFormData] = useState({
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

    // Event form data
    const [eventFormData, setEventFormData] = useState({
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

    // Form validation and loading
    const [formErrors, setFormErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);

    return {
        clubFormData,
        setClubFormData,
        eventFormData,
        setEventFormData,
        formErrors,
        setFormErrors,
        submitLoading,
        setSubmitLoading
    };
};
