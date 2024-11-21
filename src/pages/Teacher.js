import React from 'react';
import { useParams } from 'react-router-dom';

function Teacher() {
  const { teacherId } = useParams();

  return (
    <div>
      <h1>Teacher Information</h1>
      <p>Teacher ID: {teacherId}</p>
    </div>
  );
}

export default Teacher;
