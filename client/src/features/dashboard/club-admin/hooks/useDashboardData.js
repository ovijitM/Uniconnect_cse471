import { useState } from 'react';

// Custom hook for managing dashboard data state
export const useDashboardData = () => {
    const [loading, setLoading] = useState(true);
    const [myClubs, setMyClubs] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [universities, setUniversities] = useState([]);

    const [stats, setStats] = useState({
        totalClubs: 0,
        totalEvents: 0,
        totalMembers: 0,
        upcomingEvents: 0
    });

    return {
        loading,
        setLoading,
        myClubs,
        setMyClubs,
        myEvents,
        setMyEvents,
        universities,
        setUniversities,
        stats,
        setStats
    };
};
