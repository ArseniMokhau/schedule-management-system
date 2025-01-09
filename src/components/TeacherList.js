import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/TeacherList.css';

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/Main/teacher/all`);

        if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
          throw new Error('Failed to fetch teachers. Server might be redirecting or returning HTML.');
        }

        const data = await response.json();
        setTeachers(data);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError('Failed to load teacher data. Please try again later.');
      }
    };

    fetchTeachers();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="teacher-list-container">
      <button
        className="toggle-button"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? 'Hide Teacher List' : 'Show Teacher List'}
      </button>
      <div
        className={`teacher-list ${isExpanded ? 'expanded' : ''}`}
      >
        {teachers.length === 0 ? (
          <div>Loading...</div>
        ) : (
          <div className="scrollable-teacher-list">
            {teachers.map((teacher) => (
              <button
                key={teacher.TeacherId}
                className="teacher-button"
                title={`${teacher.TeacherName} - ${teacher.TeacherTitle}`}
              >
                <Link
                  to={`/teacher/${teacher.TeacherName}/${teacher.TeacherTitle}/${teacher.TeacherId}`}
                >
                  {teacher.TeacherName}
                </Link>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherList;
