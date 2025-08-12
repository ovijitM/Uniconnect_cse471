import { useState } from 'react';

// Custom hook for managing dialog states
export const useDialogStates = () => {
    const [tabValue, setTabValue] = useState(0);
    const [clubFormOpen, setClubFormOpen] = useState(false);
    const [eventFormOpen, setEventFormOpen] = useState(false);
    const [memberManagementOpen, setMemberManagementOpen] = useState(false);
    const [attendeeManagementOpen, setAttendeeManagementOpen] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Priority 3 dialogs
    const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);
    const [analyticsOpen, setAnalyticsOpen] = useState(false);
    const [achievementManagementOpen, setAchievementManagementOpen] = useState(false);
    const [eventTemplateOpen, setEventTemplateOpen] = useState(false);
    const [communicationHubOpen, setCommunicationHubOpen] = useState(false);
    const [roleManagementOpen, setRoleManagementOpen] = useState(false);

    return {
        tabValue,
        setTabValue,
        clubFormOpen,
        setClubFormOpen,
        eventFormOpen,
        setEventFormOpen,
        memberManagementOpen,
        setMemberManagementOpen,
        attendeeManagementOpen,
        setAttendeeManagementOpen,
        selectedClub,
        setSelectedClub,
        selectedEvent,
        setSelectedEvent,
        editMode,
        setEditMode,
        notificationSettingsOpen,
        setNotificationSettingsOpen,
        analyticsOpen,
        setAnalyticsOpen,
        achievementManagementOpen,
        setAchievementManagementOpen,
        eventTemplateOpen,
        setEventTemplateOpen,
        communicationHubOpen,
        setCommunicationHubOpen,
        roleManagementOpen,
        setRoleManagementOpen
    };
};
