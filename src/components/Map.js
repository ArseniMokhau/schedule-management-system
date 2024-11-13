import React, { useState, useEffect, useCallback } from 'react';
import buildings from '../data/Buildings'; // Import data from Buildings.js
import { toZonedTime } from 'date-fns-tz'; // For handling time zone conversion
import { parseISO, isWithinInterval } from 'date-fns'; // For handling date comparisons

function Map() {
  const [currentBuilding, setCurrentBuilding] = useState(buildings[0]); // The building being displayed
  const [currentFloor, setCurrentFloor] = useState(currentBuilding.floors[0]); // The current floor being viewed
  const [classroomStatus, setClassroomStatus] = useState(currentFloor.classrooms); // The status of classrooms
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch classroom data from backend
  const fetchClassroomData = useCallback(async () => {
    console.log('Fetching classroom data...');

    try {
        // Get the current time in Poland and adjust the weekday
        const currentDate = new Date();
        const polandTime = toZonedTime(currentDate, 'Europe/Warsaw');
        const dayOfWeek = (polandTime.getDay() + 6) % 7; // Adjust so 0 = Monday, 6 = Sunday

        // Fetch data from the backend with the day of the week
        const response = await fetch(`${process.env.REACT_APP_API_URL}/Main/classes/day/dayOfWeek?dayOfWeek=${dayOfWeek}`);

        // Check if the response is not ok (e.g., 404 or 500 status)
        if (!response.ok) {
            // If it's a 404 (no classes for this day), we treat it as a normal situation
            if (response.status === 404) {
                setClassroomStatus([]); // Optionally, clear classroom statuses if no classes are found
                setErrorMessage(`No classes found for the specified day of the week: ${new Date(polandTime).toLocaleString('en-us', { weekday: 'long' })}.`);
                return; // Exit early for 404
            } else {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
        }

        // Parse the response data if no error occurred
        const fetchedClasses = await response.json();

        // Adjust recurrenceEndTime from "1.00:00:00" to "24:00:00"
        const correctedClasses = fetchedClasses.map(classData => {
            // Check if the recurrenceEndTime is "1.00:00:00"
            if (classData.recurrenceEndTime === "1.00:00:00") {
                // Correct it to "24:00:00"
                classData.recurrenceEndTime = "24:00:00";
            }
            return classData;
        });

        // Track active classrooms based on the fetched and corrected data
        const activeClassrooms = [];

        correctedClasses.forEach((classData) => {
            const { roomNumber, recurrenceStartTime, recurrenceEndTime, recurrenceDay } = classData;

            // Only process classes for the current day
            if (recurrenceDay === dayOfWeek) {
                // Parse the start and end times with today’s date in Poland’s timezone
                const startTime = parseISO(`${polandTime.toISOString().split('T')[0]}T${recurrenceStartTime}`);
                const endTime = parseISO(`${polandTime.toISOString().split('T')[0]}T${recurrenceEndTime}`);

                // Check if the current time is within the class time range
                if (isWithinInterval(polandTime, { start: startTime, end: endTime })) {
                    activeClassrooms.push(roomNumber);
                }
            }
        });

        // Update classroom statuses and teacher names based on active classrooms
        const updatedClassroomStatus = currentFloor.classrooms.map((classroom) => {
            // Find the class data matching the current classroom
            const matchingClass = correctedClasses.find(classData => classData.roomNumber === classroom.number);
            const teacherName = matchingClass ? matchingClass.teacherName : '';
            const teacherId = matchingClass ? matchingClass.teacherId : '';
            const roomId = matchingClass ? matchingClass.roomId : '';
            const classTitle = matchingClass ? matchingClass.classTitle : '';

            return {
                ...classroom,
                status: activeClassrooms.includes(classroom.number) ? 'taken' : 'empty',
                teacherName: teacherName, // Include teacher name in the classroom status
            };
        });

        setClassroomStatus(updatedClassroomStatus); // Update state with the new classroom status
        setErrorMessage(null); // Clear any previous error message

    } catch (error) {
        console.error('Error fetching classroom data:', error);
        setErrorMessage('Failed to fetch classroom data. Please try again later.'); // Show generic error if fetch fails
    }
}, [currentFloor]);



  // useEffect to fetch classroom data on mount and refresh every 5 minutes
  useEffect(() => {
    fetchClassroomData(); // Call fetchClassroomData when the effect runs
    const interval = setInterval(fetchClassroomData, 5 * 60 * 1000); // Set interval for every 5 minutes

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(interval);
  }, [currentFloor, fetchClassroomData]);

  // Function to change the current floor
  const handleFloorChange = (floorNumber) => {
    const selectedFloor = currentBuilding.floors.find(floor => floor.floorNumber === floorNumber);
    setCurrentFloor(selectedFloor); // Update the current floor state
  };

  // Render classrooms as buttons with status circles
  const renderClassrooms = () => {
    return classroomStatus.map((classroom, index) => (
        <button key={index} className="classroom-button">
            <span>{classroom.number}</span>
            <span
                className={`status-circle ${classroom.status === 'taken' ? 'taken' : 'empty'}`}
            ></span>
            <span>{classroom.teacherName || 'No teacher'}</span> {/* Display teacher's name */}
        </button>
    ));
};

  // Function to change the current building
  const handleBuildingChange = (buildingName) => {
    const selectedBuilding = buildings.find(building => building.name === buildingName);
    setCurrentBuilding(selectedBuilding);
    setCurrentFloor(selectedBuilding.floors[0]); // Set the first floor of the selected building
  };

  return (
    <div className="map-container">
      <h2>{currentBuilding.name}</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message if there is one */}

      <div className="floor-selector">
        {currentBuilding.floors.map(floor => (
          <button
            key={floor.floorNumber}
            onClick={() => handleFloorChange(floor.floorNumber)}
          >
            Floor {floor.floorNumber}
          </button>
        ))}
      </div>

      <div className="classrooms-list">
        <h3>Floor {currentFloor.floorNumber}</h3>
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
