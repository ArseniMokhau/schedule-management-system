import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toZonedTime } from 'date-fns-tz';
import { parseISO, isWithinInterval, format, setMinutes, setHours } from 'date-fns';

function Map() {
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const [currentFloor, setCurrentFloor] = useState(null);
  const [classroomStatus, setClassroomStatus] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [fetchedClasses, setFetchedClasses] = useState([]);

  const fetchRoomData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Main/room/all`);
      if (!response.ok) {
        throw new Error(`Error fetching rooms: ${response.statusText}`);
      }
      const rooms = await response.json();

      const groupedByFloor = rooms.reduce((acc, room) => {
        const floorNumber = parseInt(room.RoomNumber.charAt(0), 10); 
        if (!acc[floorNumber]) {
          acc[floorNumber] = [];
        }
        acc[floorNumber].push({
          number: room.RoomNumber,
          status: 'empty',  
          roomId: room.RoomId,
          campusName: 'MS'  
        });
        return acc;
      }, {});

      const building = {
        name: 'MS',
        fullName: 'Wydział Matematyki Stosowanej',
        floors: Object.keys(groupedByFloor)
          .map(floorNumber => ({
            floorNumber: parseInt(floorNumber, 10),
            classrooms: groupedByFloor[floorNumber]
          }))
          .sort((a, b) => a.floorNumber - b.floorNumber)
      };

      setCurrentBuilding(building);
      setCurrentFloor(building.floors[0]); 
      setClassroomStatus(building.floors[0]?.classrooms || []);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error fetching room data:', error);
      setErrorMessage('Failed to fetch room data. Please try again later.');
    }
  }, []);

  const fetchClassData = useCallback(async () => {
    try {
      // Fetch recurring classes
      const polandTime = toZonedTime(selectedDate, 'Europe/Warsaw');
      const dayOfWeek = polandTime.getDay() % 7;
  
      const recurringResponse = await fetch(`${process.env.REACT_APP_API_URL}/Main/classes/day/dayOfWeek?dayOfWeek=${dayOfWeek}`);
      if (!recurringResponse.ok) {
        throw new Error(`Error fetching recurring classes: ${recurringResponse.statusText}`);
      }
      const recurringClasses = await recurringResponse.json();
  
      // Fetch one-time classes
      const oneTimeResponse = await fetch(`${process.env.REACT_APP_API_URL}/Main/classes/date/OneTimeClass?date=${format(polandTime, 'yyyy-MM-dd')}`);
      if (!oneTimeResponse.ok) {
        throw new Error(`Error fetching one-time classes: ${oneTimeResponse.statusText}`);
      }
      const oneTimeClasses = await oneTimeResponse.json();

      const combinedClasses = [...recurringClasses, ...oneTimeClasses].map(classData => {
        if (classData.recurrenceEndTime === '1.00:00:00') {
          classData.recurrenceEndTime = '24:00:00';
        }
        return classData;
      });
  
      setFetchedClasses(combinedClasses);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error fetching class data:', error);
      setErrorMessage('Failed to fetch class data. Please try again later.');
    }
  }, [selectedDate]);  

  const filterClassroomsByTime = useCallback(() => {
    // Mapping of days to their corresponding day numbers
    const dayMapping = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
  
    const calculateWeekParity = (date) => {
      const startDate = new Date(2024, 0, 1); // January 1, 2024
      const daysSinceStart = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
      const weekNumber = Math.floor(daysSinceStart / 7) + 1;
      return weekNumber % 2 === 0 ? "even" : "odd";
    };
  
    const polandTime = toZonedTime(new Date(selectedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes())), 'Europe/Warsaw');
    const selectedDateString = polandTime.toISOString().split('T')[0];
    const dayOfWeek = polandTime.getDay() % 7;
  
    const activeClassrooms = [];
    const currentWeekParity = calculateWeekParity(polandTime);
  
    fetchedClasses.forEach(classData => {
      const {
        roomNumber,
        recurrenceStartTime,
        recurrenceEndTime,
        recurrenceDay,
        teacherName,
        teacherId,
        teacherTitle,
        classTitle,
        canceledDates,
        isEveryWeek,
        isEven,
        oneTimeClassFullDate,
        oneTimeClassStartTime,
        oneTimeClassEndTime,
        isCanceled,
      } = classData;
  
      if (oneTimeClassFullDate) {
        if (oneTimeClassFullDate.includes(selectedDateString)) {
          const startTime = parseISO(`${selectedDateString}T${oneTimeClassStartTime[0]}`);
          const endTime = parseISO(`${selectedDateString}T${oneTimeClassEndTime[0]}`);
          if (isCanceled === "False") {
            if (isWithinInterval(polandTime, { start: startTime, end: endTime })) {
              activeClassrooms.push({
                roomNumber,
                teacherName,
                teacherId,
                teacherTitle,
                classTitle,
                status: 'taken',
                canceledNotice: null,
              });
            }
          }
          else {  
            if (isWithinInterval(polandTime, { start: startTime, end: endTime })) {
              activeClassrooms.push({
                roomNumber,
                teacherName,
                teacherId,
                teacherTitle,
                classTitle,
                status: 'canceled',
                canceledNotice: 'Class is canceled',
              });
            }
          }
        }
      } else {
        const recurrenceDayNumber = dayMapping[recurrenceDay];
  
        if (recurrenceDayNumber === dayOfWeek) {
          const startTime = parseISO(`${selectedDateString}T${recurrenceStartTime}`);
          const endTime = parseISO(`${selectedDateString}T${recurrenceEndTime}`);
  
          if (isWithinInterval(polandTime, { start: startTime, end: endTime })) {
            if (isEveryWeek === "True") {
              const isCanceled = canceledDates.includes(format(polandTime, 'dd/MM/yyyy'));
              activeClassrooms.push({
                roomNumber,
                teacherName,
                teacherId,
                teacherTitle,
                classTitle,
                status: isCanceled ? 'canceled' : 'taken',
                canceledNotice: isCanceled ? 'Class is canceled today' : null,
              });
            } else {
              if (currentWeekParity === (isEven === "True" ? "even" : "odd")) {
                const isCanceled = canceledDates.includes(format(polandTime, 'dd/MM/yyyy'));
                activeClassrooms.push({
                  roomNumber,
                  teacherName,
                  teacherId,
                  teacherTitle,
                  classTitle,
                  status: isCanceled ? 'canceled' : 'taken',
                  canceledNotice: isCanceled ? 'Class is canceled today' : null,
                });
              } else {
                activeClassrooms.push({
                  roomNumber,
                  teacherName,
                  teacherId,
                  teacherTitle,
                  classTitle,
                  status: 'empty',
                  canceledNotice: null,
                });
              }
            }
          }
        }
      }
    });
  
    const updatedClassroomStatus = currentFloor.classrooms.map(classroom => {
      const activeClassroom = activeClassrooms.find(activeClass => activeClass.roomNumber === classroom.number);
      return {
        ...classroom,
        status: activeClassroom ? activeClassroom.status : 'empty',
        teacherName: activeClassroom?.teacherName || null,
        teacherId: activeClassroom?.teacherId || null,
        teacherTitle: activeClassroom?.teacherTitle || null,
        classTitle: activeClassroom?.classTitle || null,
        canceledNotice: activeClassroom?.canceledNotice || null,
      };
    });
    setClassroomStatus(updatedClassroomStatus);
  }, [currentFloor, fetchedClasses, selectedDate, selectedTime]);
  

  useEffect(() => {
    fetchRoomData();
  }, [fetchRoomData]);

  useEffect(() => {
    fetchClassData();
  }, [fetchClassData, selectedDate]);

  useEffect(() => {
    if (currentFloor && fetchedClasses.length) {
      filterClassroomsByTime();
    }
  }, [currentFloor, filterClassroomsByTime, fetchedClasses.length, selectedTime]);

  const handleFloorChange = (floorNumber) => {
    const selectedFloor = currentBuilding.floors.find(floor => floor.floorNumber === floorNumber);
    setCurrentFloor(selectedFloor);
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
    setSelectedDate(newDate);
  }

  const handleTimeChange = (event) => {
    const minutes = event.target.value;
    const hours = Math.floor(minutes / 60);
    const newTime = setMinutes(setHours(selectedTime, hours), minutes % 60);
    setSelectedTime(newTime);
  };

  const renderClassrooms = () => {
    return classroomStatus.map((classroom, index) => (
      <div key={index} className="classroom-container">
        <div className="classroom-header">
          <Link to={`/classroom/${classroom.campusName || 'MS'}/${classroom.number}/${classroom.roomId}`} className="classroom-number">
            {classroom.number}
          </Link>
          <span className={`status-circle ${classroom.status === 'taken' ? 'taken' : classroom.status === 'canceled' ? 'canceled' : 'empty'}`}></span>
        </div>
        <div className="classroom-details">
          {classroom.status === 'taken' ? (
            <>
              <Link to={`/teacher/${classroom.teacherName}/${classroom.teacherTitle}/${classroom.teacherId}`} className="teacher-name">
                {classroom.teacherName || 'No teacher'}
              </Link>
              <div className="class-title">
                {classroom.classTitle || 'No subject'}
              </div>
            </>
          ) : classroom.status === 'canceled' ? (
            <>
              <Link to={`/teacher/${classroom.teacherName}/${classroom.teacherTitle}/${classroom.teacherId}`} className="teacher-name">
                {classroom.teacherName || 'No teacher'}
              </Link>
              <div className="class-title">
                {classroom.classTitle || 'No subject'}
              </div>
              <span className="canceled-notice">{classroom.canceledNotice}</span>
            </>
          ) : (
            <span className="classroom-number">{'Empty'}</span>
          )}
        </div>
        <div className="classroom-time">
          {classroom.recurrenceStartTime} - {classroom.recurrenceEndTime}
        </div>
      </div>
    ));
  };
  

  const timeToMinutes = (time) => {
    return time.getHours() * 60 + time.getMinutes();
  };

  return (
    <div className="map-container">
      <h2>{currentBuilding?.fullName}</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="date-time-selector">
        <label>
          Select Date:
          <input type="date" onChange={handleDateChange} value={format(selectedDate, 'yyyy-MM-dd')} />
        </label>

        <div className="time-slider">
          <label>Set Time:</label>
          <input
            type="range"
            min={0}
            max={1435}
            step={5}
            value={timeToMinutes(selectedTime)}
            onChange={handleTimeChange}
          />
          <span>{format(selectedTime, 'HH:mm')}</span>
        </div>
      </div>

      <div className="floor-selector">
        {currentBuilding?.floors?.map(floor => (
          <button key={floor.floorNumber} onClick={() => handleFloorChange(floor.floorNumber)}>
            Floor {floor.floorNumber}
          </button>
        ))}
      </div>

      <div className="classrooms-list">
        {renderClassrooms()}
      </div>
    </div>
  );
}

export default Map;
