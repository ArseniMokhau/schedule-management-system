import React, { useEffect, useState, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, parseISO, isWithinInterval, addWeeks } from 'date-fns';

function WeeklySchedule({ roomId }) {
  const [classes, setClasses] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(new Date(), 'Europe/Warsaw');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchClasses = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Main/classes/room/id?roomId=${roomId}`);
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
  }, [roomId]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const organizeClassesByWeek = () => {
    const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  
    const normalizeTime = (time) => (time === "1.00:00:00" ? "24:00:00" : time);
  
    const parseTime = (time) => parseISO(`2000-01-01T${normalizeTime(time)}`);
  
    // Create an array to hold the classes for each day of the week
    const weeklySchedule = daysOfWeek.map(() => []);
  
    // Iterate through each class data
    classes.forEach((classData) => {
      // Process recurring classes
      if (classData.recurringClasses && classData.recurringClasses.length > 0) {
        classData.recurringClasses.forEach((recurringClass) => {
          const dayIndex = recurringClass.recurrenceDay;
          weeklySchedule[dayIndex].push({
            ...classData,
            recurrenceStartTime: normalizeTime(recurringClass.recurrenceStartTime),
            recurrenceEndTime: normalizeTime(recurringClass.recurrenceEndTime),
            classType: 'Recurring', // Mark as recurring class
          });
        });
      }
  
      // Process one-time classes
      if (classData.oneTimeClasses && classData.oneTimeClasses.length > 0) {
        classData.oneTimeClasses.forEach((oneTimeClass) => {
          const classDate = parseISO(oneTimeClass.oneTimeClassFullDate);
          if (isWithinInterval(classDate, { start: weekStart, end: weekEnd })) {
            const dayIndex = (classDate.getDay() + 6) % 7; // Ensure correct index for the day of the week
            weeklySchedule[dayIndex].push({
              ...classData,
              date: classDate,
              recurrenceStartTime: normalizeTime(oneTimeClass.oneTimeClassStartTime),
              recurrenceEndTime: normalizeTime(oneTimeClass.oneTimeClassEndTime),
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
                  <p className="weekly-schedule-class-time">
                    {format(parseISO(`2000-01-01T${classData.recurrenceStartTime}`), 'HH:mm')} -{' '}
                    {format(parseISO(`2000-01-01T${classData.recurrenceEndTime}`), 'HH:mm')}
                  </p>
                  <p className="weekly-schedule-class-teacher">{classData.teacherName}</p>
                  <span className="weekly-schedule-class-type">{classData.classType}</span>
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
