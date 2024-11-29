import React, { useState, useEffect, useCallback } from 'react';
import buildings from '../data/Buildings';
import { toZonedTime } from 'date-fns-tz';
import { parseISO, isWithinInterval, format, setMinutes, setHours } from 'date-fns';

function Map() {
  const [currentBuilding, setCurrentBuilding] = useState(buildings[0]);
  const [currentFloor, setCurrentFloor] = useState(currentBuilding.floors[0]);
  const [classroomStatus, setClassroomStatus] = useState(currentFloor.classrooms);
  const [errorMessage, setErrorMessage] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [fetchedClasses, setFetchedClasses] = useState([]); // Store fetched class data

  // Filter by time function, updated with fetchedClasses as a dependency
  const filterByTime = useCallback(() => {
    const polandTime = toZonedTime(new Date(selectedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes())), 'Europe/Warsaw');
    const dayOfWeek = (polandTime.getDay() + 6) % 7;

    const activeClassrooms = [];
    fetchedClasses.forEach((classData) => {
      const { roomNumber, recurrenceStartTime, recurrenceEndTime, recurrenceDay } = classData;

      if (recurrenceDay === dayOfWeek) {
        const startTime = parseISO(`${polandTime.toISOString().split('T')[0]}T${recurrenceStartTime}`);
        const endTime = parseISO(`${polandTime.toISOString().split('T')[0]}T${recurrenceEndTime}`);

        if (isWithinInterval(polandTime, { start: startTime, end: endTime })) {
          activeClassrooms.push(roomNumber);
        }
      }
    });

    const updatedClassroomStatus = currentFloor.classrooms.map((classroom) => {
      const matchingClass = fetchedClasses.find(classData => classData.roomNumber === classroom.number);
      const teacherName = matchingClass ? matchingClass.teacherName : '';
      const teacherTitle = matchingClass ? matchingClass.teacherTitle : '';
      const teacherId = matchingClass ? matchingClass.teacherId : '';
      const roomId = matchingClass ? matchingClass.roomId : '';
      const classTitle = matchingClass ? matchingClass.classTitle : '';
      const recurrenceStartTime = matchingClass ? matchingClass.recurrenceStartTime : '';
      const recurrenceEndTime = matchingClass ? matchingClass.recurrenceEndTime : '';

      return {
        ...classroom,
        status: activeClassrooms.includes(classroom.number) ? 'taken' : 'empty',
        teacherName,
        teacherTitle,
        teacherId,
        roomId,
        classTitle,
        recurrenceStartTime,
        recurrenceEndTime
      };
    });

    const clearedClassroomStatus = clearInactiveClassrooms(updatedClassroomStatus);

    setClassroomStatus(clearedClassroomStatus);
    
  }, [currentFloor, selectedDate, selectedTime, fetchedClasses]);

  // Function to clear data for inactive classrooms
  const clearInactiveClassrooms = (classrooms) => {
    return classrooms.map(classroom => {
      if (classroom.status === 'empty') {
        return {
          ...classroom,
          teacherName: '',  // Clear teacher name
          teacherTitle: '', // Clear teacher title
          teacherId: '',    // Clear teacher ID
          roomId: '',       // Clear room ID
          classTitle: '',   // Clear class title
          recurrenceStartTime: '',  // Clear recurrence start time
          recurrenceEndTime: ''     // Clear recurrence end time
        };
      }
      return classroom;
    });
  };

  // Fetch data only once based on the selected day
  const fetchClassData = useCallback(async () => {
    try {
      const polandTime = toZonedTime(selectedDate, 'Europe/Warsaw');
      const dayOfWeek = (polandTime.getDay() + 6) % 7;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/Main/classes/day/dayOfWeek?dayOfWeek=${dayOfWeek}`);
      if (!response.ok) {
        if (response.status === 404) {
          setClassroomStatus([]);
          setErrorMessage(`No classes found for ${polandTime.toLocaleString('en-us', { weekday: 'long' })}.`);
          return;
        } else {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
      }

      const data = await response.json();
      const correctedData = data.map(classData => {
        if (classData.recurrenceEndTime === "1.00:00:00") {
          classData.recurrenceEndTime = "24:00:00";
        }
        return classData;
      });

      setFetchedClasses(correctedData); // Store the data locally
      setErrorMessage(null);
    } catch (error) {
      console.error('Error fetching classroom data:', error);
      setErrorMessage('Failed to fetch classroom data. Please try again later.');
    }
  }, [selectedDate]);

  // useEffect to refilter data whenever time changes
  useEffect(() => {
    filterByTime(); // Filter data on time change or when fetched data updates
  }, [filterByTime, fetchedClasses]);

  // Fetch the data only on the initial date load
  useEffect(() => {
    fetchClassData();
  }, [fetchClassData]);

  const handleFloorChange = (floorNumber) => {
    const selectedFloor = currentBuilding.floors.find(floor => floor.floorNumber === floorNumber);
    setCurrentFloor(selectedFloor);
  };

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
  };

  const renderClassrooms = () => {
    return classroomStatus.map((classroom, index) => (
      <div key={index} className="classroom-container">
        <div className="classroom-header">
          <a href={`/classroom/${classroom.number}/${classroom.roomId}`} className="classroom-number">
            {classroom.number}
          </a>
          <span className={`status-circle ${classroom.status === 'taken' ? 'taken' : 'empty'}`}></span>
        </div>
        <div className="classroom-details">
          {classroom.teacherName ? (
            <a href={`/teacher/${classroom.teacherName}/${classroom.teacherTitle}/${classroom.teacherId}`} className="teacher-name">
              {classroom.teacherName || 'No teacher'}
            </a>
          ) : (
            <span className="classroom-number">{'Empty'}</span>
          )}
          <div className="class-title">
            {classroom.classTitle}
          </div>
        </div>
        <div className="classroom-time">
          {classroom.recurrenceStartTime} - {classroom.recurrenceEndTime}
        </div>
      </div>
    ));
  };

  const handleBuildingChange = (buildingName) => {
    const selectedBuilding = buildings.find(building => building.name === buildingName);
    setCurrentBuilding(selectedBuilding);
    setCurrentFloor(selectedBuilding.floors[0]);
  };

  const handleTimeChange = (event) => {
    const minutes = event.target.value;
    const hours = Math.floor(minutes / 60);
    const newTime = setMinutes(setHours(selectedTime, hours), minutes % 60);
    setSelectedTime(newTime);
  };

  const timeToMinutes = (time) => {
    return time.getHours() * 60 + time.getMinutes();
  };

  return (
    <div className="map-container">
      <h2>{currentBuilding.name}</h2>

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
            max={1435} // 24 hours * 60 minutes
            step={5} // Increment by 5 minutes
            value={timeToMinutes(selectedTime)}
            onChange={handleTimeChange}
          />
          <span>{format(selectedTime, 'HH:mm')}</span>
        </div>
      </div>

      <div className="floor-selector">
        {currentBuilding.floors.map(floor => (
          <button key={floor.floorNumber} onClick={() => handleFloorChange(floor.floorNumber)}>
            Floor {floor.floorNumber}
          </button>
        ))}
      </div>

      <div className="classrooms-list">
        <div className="classrooms">
          {renderClassrooms()}
        </div>
      </div>

      {buildings.length > 1 && (
        <div className="building-selector">
          <h3>Change Building</h3>
          {buildings.map(building => (
            <button key={building.name} onClick={() => handleBuildingChange(building.name)}>
              {building.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Map;
