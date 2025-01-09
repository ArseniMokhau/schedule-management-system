import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

const CreateClass = ({ onClassCreated }) => {
  const { isLoggedIn, teacherId, token } = useUser();
  const [roomNumber, setRoomNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [campusName, setCampusName] = useState('');
  const [isOneTimeClass, setIsOneTimeClass] = useState(false);
  const [oneTimeClassFullDate, setOneTimeClassFullDate] = useState('');
  const [oneTimeClassStartTime, setOneTimeClassStartTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [oneTimeClassEndTime, setOneTimeClassEndTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const [isEveryWeek, setIsEveryWeek] = useState(false);
  const [isEven, setIsEven] = useState(false);
  const [recurrenceDay, setRecurrenceDay] = useState(0);
  const [recurrenceStartTime, setRecurrenceStartTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [recurrenceEndTime, setRecurrenceEndTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const [classrooms, setClassrooms] = useState([]); // Store the fetched classrooms
  const [campuses] = useState(['MS']); // List of campuses (in this case, you can populate this if needed)

  useEffect(() => {
    // Fetch classrooms from the API
    const fetchClassrooms = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/Main/room/all`);
        const data = await response.json();
        if (response.ok) {
          // Sort classrooms based on room number (numerically)
          const sortedClassrooms = data.sort((a, b) => {
            return a.RoomNumber - b.RoomNumber;
          });
          setClassrooms(sortedClassrooms); // Update the classrooms state with sorted rooms
        } else {
          console.error('Failed to fetch classrooms:', data.message);
        }
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      }
    };

    fetchClassrooms();
  }, []); // Only run once when the component mounts

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLoggedIn || !teacherId || !token) {
      alert('User not logged in or missing credentials. Please log in again.');
      return;
    }

    const classData = {
      roomNumber,
      title,
      description,
      campusName,
      isOneTimeClass,
      oneTimeClassFullDate: isOneTimeClass ? oneTimeClassFullDate : null,
      oneTimeClassStartTime: isOneTimeClass ? oneTimeClassStartTime : { hours: 0, minutes: 0, seconds: 0 },
      oneTimeClassEndTime: isOneTimeClass ? oneTimeClassEndTime : { hours: 0, minutes: 0, seconds: 0 },
      isEveryWeek: !isOneTimeClass ? isEveryWeek : false,
      isEven: !isOneTimeClass && !isEveryWeek ? isEven : false,
      recurrenceDay: !isOneTimeClass ? recurrenceDay : 0,
      recurrenceStartTime: !isOneTimeClass ? recurrenceStartTime : { hours: 0, minutes: 0, seconds: 0 },
      recurrenceEndTime: !isOneTimeClass ? recurrenceEndTime : { hours: 0, minutes: 0, seconds: 0 },
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/Main/createClass?teacherId=${teacherId}&teacherToken=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(classData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert('Class created successfully!');
        onClassCreated();
      } else {
        alert('Error creating class: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the class');
    }
  };

  return (
    <div className="create-class-container">
      <h2>Create New Class</h2>
      <form onSubmit={handleSubmit} className="create-class-form">
        <div className="form-group">
          <label htmlFor="campusName">Campus</label>
          <select
            id="campusName"
            value={campusName}
            onChange={(e) => setCampusName(e.target.value)}
            required
          >
            <option value="">Select a campus</option>
            {campuses.map((campus) => (
              <option key={campus} value={campus}>
                {campus}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="roomNumber">Room Number</label>
          <select
            id="roomNumber"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          >
            <option value="">Select a room</option>
            {classrooms.map((classroom) => (
              <option key={classroom.RoomId} value={classroom.RoomNumber}>
                {classroom.RoomNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Class Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="isOneTimeClass">One-time Class</label>
          <input
            type="checkbox"
            id="isOneTimeClass"
            checked={isOneTimeClass}
            onChange={() => setIsOneTimeClass((prev) => !prev)}
          />
        </div>

        {isOneTimeClass ? (
          <>
            <div className="form-group">
              <label htmlFor="oneTimeClassFullDate">Class Date</label>
              <input
                type="date"
                id="oneTimeClassFullDate"
                value={oneTimeClassFullDate}
                onChange={(e) => setOneTimeClassFullDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={`${String(oneTimeClassStartTime.hours).padStart(2, '0')}:${String(oneTimeClassStartTime.minutes).padStart(2, '0')}`}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  setOneTimeClassStartTime({ hours: Number(hours), minutes: Number(minutes), seconds: 0 });
                }}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={`${String(oneTimeClassEndTime.hours).padStart(2, '0')}:${String(oneTimeClassEndTime.minutes).padStart(2, '0')}`}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  setOneTimeClassEndTime({ hours: Number(hours), minutes: Number(minutes), seconds: 0 });
                }}
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="isEveryWeek">Repeat Weekly</label>
              <input
                type="checkbox"
                id="isEveryWeek"
                checked={isEveryWeek}
                onChange={() => setIsEveryWeek((prev) => !prev)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="recurrenceDay">Recurrence Day</label>
              <select
                id="recurrenceDay"
                value={recurrenceDay}
                onChange={(e) => setRecurrenceDay(Number(e.target.value))}
              >
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
                <option value={0}>Sunday</option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={`${String(recurrenceStartTime.hours).padStart(2, '0')}:${String(recurrenceStartTime.minutes).padStart(2, '0')}`}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  setRecurrenceStartTime({ hours: Number(hours), minutes: Number(minutes), seconds: 0 });
                }}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={`${String(recurrenceEndTime.hours).padStart(2, '0')}:${String(recurrenceEndTime.minutes).padStart(2, '0')}`}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  setRecurrenceEndTime({ hours: Number(hours), minutes: Number(minutes), seconds: 0 });
                }}
                required
              />
            </div>

            {!isEveryWeek && (
              <div className="form-group">
                <label htmlFor="isEven">Even Weeks</label>
                <input
                  type="checkbox"
                  id="isEven"
                  checked={isEven}
                  onChange={() => setIsEven((prev) => !prev)}
                />
              </div>
            )}
          </>
        )}
        <button type="submit">Create Class</button>
      </form>
    </div>
  );
};

export default CreateClass;