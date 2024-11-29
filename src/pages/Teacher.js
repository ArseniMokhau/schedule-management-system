import React from 'react';
import { useParams } from 'react-router-dom';
import WeeklySchedule from '../components/WeeklySchedule';
import { ScheduleType } from '../data/Enums';

function Teacher() {
  const { name, title, id } = useParams();

  return (
    <div>
      <h1>Teacher Information</h1>
      <p>{name} - {title}</p>
      <p>Teacher ID: {id}</p>
      <h1>Teacher Weekly Schedule</h1>
      <WeeklySchedule id={id} scheduleType={ScheduleType.TEACHER}/>
    </div>
  );
}

export default Teacher;
