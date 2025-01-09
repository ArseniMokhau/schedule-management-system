import React, { useEffect, useState, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, parseISO, isWithinInterval, addWeeks } from 'date-fns';
import { ScheduleType } from '../data/Enums';
import { useUser } from '../contexts/UserContext';

function WeeklySchedule({ id, scheduleType, refreshTrigger }) {
  const [classes, setClasses] = useState([]);
  const { isLoggedIn, teacherId, token} = useUser();
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(new Date(), 'Europe/Warsaw');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchClasses = useCallback(async () => {
    let endpoint;

    switch (scheduleType) {
      case ScheduleType.TEACHER:
        endpoint = `${process.env.REACT_APP_API_URL}/Main/${id}/room/all`;
        break;
      case ScheduleType.ROOM:
        endpoint = `${process.env.REACT_APP_API_URL}/Main/classes/${id}/id`;
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
  
    const calculateWeekParity = (date) => {
      const startDate = new Date(2024, 0, 1); // January 1, 2024
      const daysSinceStart = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
      const weekNumber = Math.floor(daysSinceStart / 7) + 1;
      return weekNumber % 2 === 0 ? "even" : "odd";
    };
  
    const currentWeekParity = calculateWeekParity(selectedWeek); // Determine parity of selected week
  
    const weeklySchedule = daysOfWeek.map(() => []);
  
    const remapDayIndex = (dayIndex) => (dayIndex === 0 ? 6 : dayIndex - 1);
  
    classes.forEach((classData) => {
      // Process recurring classes
      classData.recurringClasses.forEach((recurringClass) => {
        const convertToISODate = (dateString) => {
          const [month, day, year] = dateString.split('/');
          return new Date(`${year}-${month}-${day}`).toISOString(); // Return ISO format directly
        };
  
        const isClassCanceledForWeek = recurringClass.canceledDates.some((canceledDate) => {
          const isoDate = convertToISODate(canceledDate); // Convert to ISO format
          const parsedCanceledDate = parseISO(isoDate); // Parse the ISO date
  
          return isWithinInterval(parsedCanceledDate, { start: weekStart, end: weekEnd });
        });
  
        const isMatchingWeek =
          recurringClass.isEveryWeek ||
          (recurringClass.isEven && currentWeekParity === 'even') ||
          (!recurringClass.isEven && currentWeekParity === 'odd');
  
        if (isMatchingWeek) {
          weeklySchedule[remapDayIndex(recurringClass.recurrenceDay)].push({
            ...classData,
            recurrenceStartTime: normalizeTime(recurringClass.recurrenceStartTime),
            recurrenceEndTime: normalizeTime(recurringClass.recurrenceEndTime),
            teacherId: classData.teacherId,
            teacherName: classData.teacherName,
            teacherTitle: classData.teacherTitle,
            roomNumber: classData.roomNumber,
            roomId: classData.roomId,
            isEveryWeek: recurringClass.isEveryWeek,
            isEven: recurringClass.isEven,
            isCanceled: isClassCanceledForWeek,
            recurrenceDay: recurringClass.recurrenceDay,
            classType: 'Recurring',
          });
        }
      });
  
      // Process one-time classes
      if (classData.oneTimeClasses && classData.oneTimeClasses.length > 0) {
        classData.oneTimeClasses.forEach((oneTimeClass) => {
          const convertToISODate = (dateString) => {
            const [month, day, year] = dateString.split('/');
            return new Date(`${year}-${month}-${day}`).toISOString(); // Return ISO format directly
          };
  
          const isoDate = convertToISODate(oneTimeClass.oneTimeClassFullDate); // Convert to ISO format
          const classDate = parseISO(isoDate);
          console.log(isoDate); // Check the isoDate
          console.log(classDate); // Check the classDate
  
          if (isWithinInterval(classDate, { start: weekStart, end: weekEnd })) {
            const dayIndex = remapDayIndex(classDate.getDay()); // Apply remap for one-time classes
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
              isCanceled: classData.isCanceled,
              classType: "One-Time",
            });
          }
        });
      }
    });
  
    weeklySchedule.forEach((dayClasses) => {
      dayClasses.sort((a, b) => parseTime(a.recurrenceStartTime) - parseTime(b.recurrenceStartTime));
    });
  
    console.log(classes);
    console.log(weeklySchedule);
  
    return weeklySchedule;
  };   

  const schedule = organizeClassesByWeek();

  const handleWeekChange = (direction) => setSelectedWeek((prevWeek) => addWeeks(prevWeek, direction));

  const handleDeleteMeeting = async (classData) => {
    try {
  
      if (!teacherId || !token) {
        alert("Authentication details are missing. Please log in again.");
        return;
      }
  
      const endpoint = `${process.env.REACT_APP_API_URL}/Main/deleteClass/${classData.classId}?teacherId=${teacherId}&teacherToken=${token}`;
  
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Unexpected server response');
      }
  
      const data = await response.json();
  
      if (data.message === 'Class and all related data deleted successfully.') {
        // Update classes state to remove deleted class
        const updatedClasses = classes.filter(
          (classItem) => classItem.classId !== classData.classId
        );
        setClasses(updatedClasses);
  
        alert(`Class ${classData.classTitle} has been deleted successfully`);
      } else {
        throw new Error('Unexpected server response');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('An error occurred while deleting the class. Please try again.');
    }
  }

  const handleCancelMeeting = async (classData) => {
    const { classId, classType, isCanceled } = classData;
    const endpointBase = `${process.env.REACT_APP_API_URL}/Main`;
    let endpoint = '';
    let method = 'POST';
    let requestBody = null;
  
    try {
      if (classType === 'One-Time') {
        // Cancel or restore one-time class
        endpoint = `${endpointBase}/cancelOrRestoreClassOneTime/${classId}?teacherId=${teacherId}&teacherToken=${token}`;
        requestBody = null;
      } 
      /*
      else if (classType === 'Recurring') {
        // Cancel or restore recurring class
        if (isCanceled) {
          endpoint = `${endpointBase}/restoreRecurringClass/${classId}`;
          requestBody = { restoreDate: classDate.toISOString() };
        } else {
          endpoint = `${endpointBase}/cancelRecurringClass/${classId}`;
          requestBody = { cancelDate: classDate.toISOString() };
        }
      } else {
        throw new Error('Unknown class type');
      }
      */
  
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody ? JSON.stringify(requestBody) : null,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update class: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (data.message === "successfully.") {
        // Update the status of the class
        const updatedClasses = classes.map((classItem) =>
          classItem.classId === classId
            ? { ...classItem, isCanceled: !isCanceled }
            : classItem
        );
        setClasses(updatedClasses); // Update state with the new status
  
        alert(`Class ${isCanceled ? 'restored' : 'canceled'} successfully.`);
      } else {
        throw new Error('Unexpected response message');
      }
    } catch (error) {
      console.error('Error updating class:', error);
      alert('An error occurred while updating the class. Please try again.');
    }
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
                  <a href={`/classroom/${classData.campusName}/${classData.roomNumber}/${classData.roomId}`} className="classroom-number">
                    {classData.roomNumber}
                  </a>
                  <p className="weekly-schedule-class-time">
                    {format(parseISO(`2000-01-01T${classData.recurrenceStartTime}`), 'HH:mm')} -{' '}
                    {format(parseISO(`2000-01-01T${classData.recurrenceEndTime}`), 'HH:mm')}
                  </p>
                  {classData.isCanceled && (<span className="">Cancelled</span>)}
                  <a href={`/teacher/${classData.teacherName}/${classData.teacherTitle}/${classData.teacherId}`} className="weekly-schedule-class-teacher">
                    {classData.teacherTitle || 'No title'}   {classData.teacherName}
                  </a>
                  <div className="class-card-buttons">
                    {isLoggedIn && teacherId === classData.teacherId && classData.classType === 'One-Time' && (
                      <button
                        className="cancel-meeting-button"
                        onClick={() => handleCancelMeeting(classData)}>
                        {classData.isCanceled ? "Restore Meeting" : "Cancel Meeting"}
                      </button>
                    )}

                    {isLoggedIn && teacherId === classData.teacherId && (
                      <button
                        className="delete-meeting-button"
                        onClick={() => handleDeleteMeeting(classData)}
                      >
                        Delete Meeting
                      </button>
                    )}
                  </div>
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
