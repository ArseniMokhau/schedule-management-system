import React from 'react';
import { useParams } from 'react-router-dom';
import WeeklySchedule from '../components/WeeklySchedule';
import { ScheduleType } from '../data/Enums';
import campusData from '../data/CampusData';

function Classroom() {
  const { campus, number, id } = useParams();
  const campusInfo = campusData[campus]; // Retrieve the data for the specific campus

  return (
    <div className="classroom-page-container">
      {/* Campus Name and Classroom Information */}
      <div className="classroom-page-header">
        <h2 className="classroom-page-title">{campusInfo.fullName}</h2>
        <div className="classroom-page-info">
          <h1 className="classroom-page-classroom-number">{number}</h1>
        </div>
      </div>

      {/* Classroom Weekly Schedule */}
      <div className="classroom-page-schedule-section">
        <h2 className="classroom-page-schedule-title">Classroom Weekly Schedule</h2>
        <WeeklySchedule id={id} scheduleType={ScheduleType.ROOM} />
      </div>

      {/* Campus Info Section */}
      <div className="classroom-page-campus-info-section">
        <div className="classroom-page-google-maps">
          <h3 className="classroom-page-google-maps-title">Campus Location</h3>
          <iframe
            src={campusInfo.mapsEmbedSrc}
            width="600"
            height="450"
            style={{ border: '0' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Google Maps embed showing the location of ${campus}`}
          ></iframe>
        </div>

        <div className="classroom-page-campus-image">
          <h3 className="classroom-page-campus-image-title">Campus Image</h3>
          <img
            src={campusInfo.imageSrc}
            alt={`${campus} campus`}
          />
        </div>
      </div>
    </div>
  );
}

export default Classroom;