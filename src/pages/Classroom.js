import React from 'react';
import { useParams } from 'react-router-dom';
import WeeklySchedule from '../components/WeeklySchedule';
import { ScheduleType } from '../data/Enums';

function Classroom() {
  const { number, id } = useParams();

  return (
    <div>
      <h1>Classroom Number: {number}</h1>
      <h2>Classroom ID: {id}</h2>
      <h1>Classroom Weekly Schedule</h1>
      <WeeklySchedule id={id} scheduleType={ScheduleType.ROOM}/>
    </div>
  );
}

export default Classroom;

