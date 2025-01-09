import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import WeeklySchedule from '../components/WeeklySchedule';
import { ScheduleType } from '../data/Enums';
import campusData from '../data/CampusData';

function Classroom() {
  const { campus, number, id } = useParams();
  const campusInfo = campusData[campus];
  const [refreshSchedule, setRefreshSchedule] = useState(false);

  const handleClassCancelled = () => {
    setRefreshSchedule((prev) => !prev);
  };

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
        <WeeklySchedule id={id} scheduleType={ScheduleType.ROOM}  refreshTrigger={refreshSchedule} onClassCancelled={handleClassCancelled}/>
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
      {/* MapHelper QR Code Section */}
      <div className="classroom-page-maphelper-section">
        <h3 className="classroom-page-maphelper-title">Get MapHelper App</h3>
        <a href="https://arsenimokhau.github.io/Map-Helper/" target="_blank" rel="noopener noreferrer">
          <img
            src={require('../resources/maphelper/qr.png')}
            alt="QR Code for MapHelper"
            className="classroom-page-maphelper-qr"
            style={{ width: '200px', height: '200px' }}
          />
        </a>
        <p>Scan the QR code or click it to open the MapHelper application.</p>
      </div>
    </div>
  );
}

export default Classroom;