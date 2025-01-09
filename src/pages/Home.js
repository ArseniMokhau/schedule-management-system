import React from 'react';
import Map from '../components/Map';
import TeacherList from '../components/TeacherList';

function Home() {
  return (
    <div className="home-page">
      <div className="content-container">
        <Map />
        <TeacherList />
      </div>
    </div>
  );
}

export default Home;