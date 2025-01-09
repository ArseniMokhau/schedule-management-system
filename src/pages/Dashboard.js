import React, { useState } from 'react';
import CreateClass from '../components/CreateClass';
import WeeklySchedule from '../components/WeeklySchedule';
import { useUser } from '../contexts/UserContext';
import { ScheduleType } from '../data/Enums';

function Dashboard() {
  const { teacherId, isLoggedIn } = useUser();
  const [refreshSchedule, setRefreshSchedule] = useState(false);

  const handleClassCreated = () => {
    setRefreshSchedule((prev) => !prev);
  };

  const handleClassCancelled = () => {
    setRefreshSchedule((prev) => !prev);
  };

  return (
    <div className="dashboard" onClassCreated={handleClassCreated}>
      {isLoggedIn && teacherId ? (
        <WeeklySchedule id={teacherId} scheduleType={ScheduleType.TEACHER} refreshTrigger={refreshSchedule} onClassCancelled={handleClassCancelled}/>
      ) : (
        <p className="dashboard-no-schedule">Please log in to view your schedule.</p>
      )}
      <CreateClass onClassCreated={handleClassCreated} />
    </div>
  );
}

export default Dashboard;