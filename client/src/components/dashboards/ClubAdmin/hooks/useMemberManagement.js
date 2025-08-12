import { useState } from 'react';

// Custom hook for managing member and attendee states
export const useMemberManagement = () => {
    const [clubMembers, setClubMembers] = useState([]);
    const [searchEmail, setSearchEmail] = useState('');
    const [searchUser, setSearchUser] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

    return {
        clubMembers,
        setClubMembers,
        searchEmail,
        setSearchEmail,
        searchUser,
        setSearchUser,
        searchLoading,
        setSearchLoading
    };
};

// Custom hook for Priority 3 features states
export const usePriority3States = () => {
    const [notifications, setNotifications] = useState([]);
    const [notificationPreferences, setNotificationPreferences] = useState({
        email: true,
        sms: false,
        push: true,
        eventReminders: true,
        memberUpdates: true,
        systemAlerts: true,
        weeklyReports: false
    });

    const [analyticsData, setAnalyticsData] = useState({
        memberGrowth: [65, 78, 82, 90, 95, 102],
        eventAttendance: [45, 67, 23, 78, 34, 89],
        engagement: [34, 56, 78, 45, 67, 89]
    });

    const [achievements, setAchievements] = useState([]);
    const [eventTemplates, setEventTemplates] = useState([]);
    const [messages, setMessages] = useState([]);
    const [roles, setRoles] = useState([]);

    return {
        notifications,
        setNotifications,
        notificationPreferences,
        setNotificationPreferences,
        analyticsData,
        setAnalyticsData,
        achievements,
        setAchievements,
        eventTemplates,
        setEventTemplates,
        messages,
        setMessages,
        roles,
        setRoles
    };
};
