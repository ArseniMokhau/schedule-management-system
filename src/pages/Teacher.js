import React from 'react';
import { useParams } from 'react-router-dom';
import WeeklySchedule from '../components/WeeklySchedule';
import { ScheduleType } from '../data/Enums';
import { TeacherPhotos } from '../data/TeacherPhotos';
import { TitleDictionary } from '../data/Titles';

function Teacher() {
  const { name, title, id } = useParams();

  const shortTitle = TitleDictionary[title] || title;

  return (
    <div className="teacher-page">
      <div className="teacher-info">
        <img 
          src={TeacherPhotos[name] || TeacherPhotos['Default']} 
          alt={name} 
          className="teacher-photo" 
        />
        <div className="teacher-details">
          <h1>{name} <span className="teacher-title">{shortTitle}</span></h1>
        </div>
      </div>

      <div className="schedule-section">
        <h1>Weekly Schedule</h1>
        <WeeklySchedule id={id} scheduleType={ScheduleType.TEACHER} />
      </div>
    </div>
  );
}

export default Teacher;
