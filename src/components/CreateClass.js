import React, { useState } from 'react';
import buildings from '../data/Buildings';

const CreateClass = ({ onClassCreated }) => {
  // State variables
  const [roomNumber, setRoomNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isOneTimeClass, setIsOneTimeClass] = useState(false);
  const [oneTimeClassFullDate, setOneTimeClassFullDate] = useState('');
  const [oneTimeClassStartTime, setOneTimeClassStartTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [oneTimeClassEndTime, setOneTimeClassEndTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const [isEveryWeek, setIsEveryWeek] = useState(false);
  const [isEven, setIsEven] = useState(false);
  const [recurrenceDay, setRecurrenceDay] = useState(0);
  const [recurrenceStartTime, setRecurrenceStartTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [recurrenceEndTime, setRecurrenceEndTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Fetch classroom numbers from buildings data
  const classrooms = buildings.flatMap(building =>
    building.floors.flatMap(floor => floor.classrooms)
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const teacherId = localStorage.getItem('teacherId');
    if (!teacherId) {
        alert('Teacher ID not found. Please log in again.');
        return;
    }

    // Construct the request body
    const classData = {
        roomNumber,
        title,
        description,
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
        // Send the POST request to create the class
        const response = await fetch(`${process.env.REACT_APP_API_URL}/Main/createClass?teacherId=${teacherId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(classData),
        });

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
          <label htmlFor="roomNumber">Room Number</label>
          <select
            id="roomNumber"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          >
            <option value="">Select a room</option>
            {classrooms.map((classroom) => (
              <option key={classroom.number} value={classroom.number}>
                {classroom.number}
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
                <option value={0}>Monday</option>
                <option value={1}>Tuesday</option>
                <option value={2}>Wednesday</option>
                <option value={3}>Thursday</option>
                <option value={4}>Friday</option>
                <option value={5}>Saturday</option>
                <option value={6}>Sunday</option>
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
