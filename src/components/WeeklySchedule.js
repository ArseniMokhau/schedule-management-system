import React, { useEffect, useState, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, parseISO, isWithinInterval, addWeeks } from 'date-fns';
import { ScheduleType } from '../data/Enums';
import { useUser } from '../contexts/UserContext';

function WeeklySchedule({ id, scheduleType, refreshTrigger }) {
  const [classes, setClasses] = useState([]);
  const { isLoggedIn, teacherId } = useUser();
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(new Date(), 'Europe/Warsaw');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchClasses = useCallback(async () => {
    let endpoint;

    switch (scheduleType) {
      case ScheduleType.TEACHER:
        endpoint = `${process.env.REACT_APP_API_URL}/Main/teacher/room/all?teacherId=${id}`;
        break;
      case ScheduleType.ROOM:
        endpoint = `${process.env.REACT_APP_API_URL}/Main/classes/room/id?roomId=${id}`;
        break;
      // Future-proofing
      default:
        throw new Error('Invalid schedule type');
    }

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error fetching classes: ${response.statusText}`);
      }
      const data = await response.json();
      setClasses(data);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setErrorMessage('Failed to load class data. Please try again later.');
    }
  }, [id, scheduleType]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses, refreshTrigger]);

  const organizeClassesByWeek = () => {
    const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  
    const normalizeTime = (time) => (time === "1.00:00:00" ? "24:00:00" : time);
  
    const parseTime = (time) => parseISO(`2000-01-01T${normalizeTime(time)}`);
  
    const weeklySchedule = daysOfWeek.map(() => []);
  
    classes.forEach((classData) => {
      // Process recurring classes
      if (classData.recurringClasses && classData.recurringClasses.length > 0) {
        classData.recurringClasses.forEach((recurringClass) => {
          const dayIndex = recurringClass.recurrenceDay;
          weeklySchedule[dayIndex].push({
            ...classData,
            recurrenceStartTime: normalizeTime(recurringClass.recurrenceStartTime),
            recurrenceEndTime: normalizeTime(recurringClass.recurrenceEndTime),
            teacherId: classData.teacherId,
            teacherName: classData.teacherName,
            teacherTitle: classData.teacherTitle,
            roomNumber: classData.roomNumber,
            roomId: classData.roomId,
            classType: 'Recurring', // Mark as recurring class
          });
        });
      }
  
      // Process one-time classes
      if (classData.oneTimeClasses && classData.oneTimeClasses.length > 0) {
        classData.oneTimeClasses.forEach((oneTimeClass) => {
          const classDate = parseISO(oneTimeClass.oneTimeClassFullDate);
          if (isWithinInterval(classDate, { start: weekStart, end: weekEnd })) {
            const dayIndex = (classDate.getDay() + 6) % 7;
            weeklySchedule[dayIndex].push({
              ...classData,
              date: classDate,
              recurrenceStartTime: normalizeTime(oneTimeClass.oneTimeClassStartTime),
              recurrenceEndTime: normalizeTime(oneTimeClass.oneTimeClassEndTime),
              teacherId: classData.teacherId,
              teacherName: classData.teacherName,
              teacherTitle: classData.teacherTitle,
              roomNumber: classData.roomNumber,
              roomId: classData.roomId,
              classType: 'One-Time', // Mark as one-time class
            });
          }
        });
      }
    });
  
    // Sort each day's classes based on start time
    weeklySchedule.forEach((dayClasses) => {
      dayClasses.sort((a, b) => parseTime(a.recurrenceStartTime) - parseTime(b.recurrenceStartTime));
    });
  
    return weeklySchedule;
  };
  

  const schedule = organizeClassesByWeek();

  const handleWeekChange = (direction) => setSelectedWeek((prevWeek) => addWeeks(prevWeek, direction));

  const handleCancelMeeting = (classId) => {
    console.log(`Cancel meeting for class ID: ${classId}`);
    // Placeholder function logic
  };

  return (
    <div className="weekly-schedule-container">
      {errorMessage && <div className="weekly-schedule-error-message">{errorMessage}</div>}

      <div className="weekly-schedule-week-selector">
        <button className="weekly-schedule-button" onClick={() => handleWeekChange(-1)}>Previous Week</button>
        <span className="weekly-schedule-date-range">
          {format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'MMM d')} -{' '}
          {format(endOfWeek(selectedWeek, { weekStartsOn: 1 }), 'MMM d')}
        </span>
        <button className="weekly-schedule-button" onClick={() => handleWeekChange(1)}>Next Week</button>
      </div>

      <div className="weekly-schedule-week">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="weekly-schedule-day-column">
            <h3 className="weekly-schedule-day-title">{day}</h3>
            {schedule[index].length > 0 ? (
              schedule[index].map((classData, idx) => (
                <div key={idx} className={`weekly-schedule-class-card weekly-schedule-${classData.classType.toLowerCase()}`}>
                  <h4 className="weekly-schedule-class-title">{classData.classTitle}</h4>
                  <a href={`/classroom/${classData.roomNumber}/${classData.roomId}`} className="classroom-number">
                    {classData.roomNumber}
                  </a>
                  <p className="weekly-schedule-class-time">
                    {format(parseISO(`2000-01-01T${classData.recurrenceStartTime}`), 'HH:mm')} -{' '}
                    {format(parseISO(`2000-01-01T${classData.recurrenceEndTime}`), 'HH:mm')}
                  </p>
                  <a href={`/teacher/${classData.teacherName}/${classData.teacherTitle}/${classData.teacherId}`} className="weekly-schedule-class-teacher">
                    {classData.teacherTitle || 'No title'}   {classData.teacherName}
                  </a>
                  <span className="weekly-schedule-class-type">{classData.classType}</span>
                  {isLoggedIn && teacherId === classData.teacherId && (
                    <button
                      className="cancel-meeting-button"
                      onClick={() => handleCancelMeeting(classData.classId)}
                    >
                      Cancel Meeting
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="weekly-schedule-no-classes">No classes</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklySchedule;
