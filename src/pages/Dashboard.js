import React, { useState } from 'react';
import CreateClass from '../components/CreateClass';
import WeeklySchedule from '../components/WeeklySchedule';
import { useUser } from '../contexts/UserContext';
import { ScheduleType } from '../data/Enums';

function Dashboard() {
  const { teacherId, isLoggedIn } = useUser();
  const [refreshSchedule, setRefreshSchedule] = useState(false);

  // Function to trigger schedule refresh
  const handleClassCreated = () => {
    setRefreshSchedule((prev) => !prev); // Toggle state to force refresh
  };

  return (
    <div className="dashboard" onClassCreated={handleClassCreated}>
      {isLoggedIn && teacherId ? (
        <WeeklySchedule id={teacherId} scheduleType={ScheduleType.TEACHER} refreshTrigger={refreshSchedule}/>
      ) : (
        <p className="dashboard-no-schedule">Please log in to view your schedule.</p>
      )}
      <CreateClass onClassCreated={handleClassCreated} />
    </div>
  );
}

export default Dashboard;