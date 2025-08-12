import React from 'react';
import {
    Tabs,
    Tab,
    Box
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MessageIcon from '@mui/icons-material/Message';
import SecurityIcon from '@mui/icons-material/Security';
import DescriptionIcon from '@mui/icons-material/Description';
import RequestPageIcon from '@mui/icons-material/RequestPage';

const DashboardTabs = ({ tabValue, setTabValue }) => {
    const tabsData = [
        { label: 'Club Requests', icon: RequestPageIcon },
        { label: 'Clubs', icon: GroupsIcon },
        { label: 'Events', icon: EventIcon },
        { label: 'Members', icon: PersonIcon },
        { label: 'Analytics', icon: AnalyticsIcon },
        { label: 'Notifications', icon: NotificationsIcon },
        { label: 'Achievements', icon: EmojiEventsIcon },
        { label: 'Templates', icon: DescriptionIcon },
        { label: 'Communication', icon: MessageIcon },
        { label: 'Roles', icon: SecurityIcon }
    ];

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
                value={tabValue}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="club admin dashboard tabs"
            >
                {tabsData.map((tab, index) => {
                    const IconComponent = tab.icon;
                    return (
                        <Tab
                            key={index}
                            label={tab.label}
                            icon={<IconComponent />}
                            iconPosition="start"
                        />
                    );
                })}
            </Tabs>
        </Box>
    );
};

export default DashboardTabs;
