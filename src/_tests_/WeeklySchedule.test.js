import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WeeklySchedule from '../components/WeeklySchedule';
import { ScheduleType } from '../data/Enums';
import { useUser } from '../contexts/UserContext';

// Mock the user context hook
jest.mock('../contexts/UserContext', () => ({
  useUser: jest.fn(),
}));

// Test data setup
const mockClasses = [
  {
    classId: 1,
    classTitle: 'Math 101',
    roomNumber: '101',
    teacherId: 123,
    teacherName: 'John Doe',
    teacherTitle: 'Prof.',
    recurrenceStartTime: '08:00:00',
    recurrenceEndTime: '09:00:00',
    isCanceled: false,
    classType: 'One-Time',
    campusName: 'Main Campus',
    roomId: 'room1',
    oneTimeClasses: [{ oneTimeClassFullDate: '2024-12-18T08:00:00', oneTimeClassStartTime: '08:00:00', oneTimeClassEndTime: '09:00:00' }]
  },
  {
    classId: 2,
    classTitle: 'History 101',
    roomNumber: '102',
    teacherId: 124,
    teacherName: 'Jane Smith',
    teacherTitle: 'Dr.',
    recurrenceStartTime: '10:00:00',
    recurrenceEndTime: '11:00:00',
    isCanceled: false,
    classType: 'Recurring',
    campusName: 'Main Campus',
    roomId: 'room2',
    recurringClasses: [
      { recurrenceDay: 3, recurrenceStartTime: '10:00:00', recurrenceEndTime: '11:00:00', isEveryWeek: true }
    ]
  }
];

// Setup mock user context
const mockUserContext = {
  isLoggedIn: true,
  teacherId: 123
};

describe('WeeklySchedule Component', () => {
  beforeEach(() => {
    // Mock the user context
    useUser.mockReturnValue(mockUserContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the weekly schedule and displays classes correctly', async () => {
    // Mock the fetch response within the test
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockClasses),
    });

    render(<WeeklySchedule id="123" scheduleType={ScheduleType.TEACHER} refreshTrigger={0} />);

    // Wait for classes to be rendered
    await waitFor(() => {
      expect(screen.getByText('Math 101')).toBeInTheDocument();
      expect(screen.getByText('History 101')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('handles error when fetching classes fails', async () => {
    // Mock the fetch to simulate an error
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch data'));

    render(<WeeklySchedule id="123" scheduleType={ScheduleType.TEACHER} refreshTrigger={0} />);

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText(/Failed to load class data/i)).toBeInTheDocument());
  });

  test('navigates between weeks', async () => {
    render(<WeeklySchedule id="123" scheduleType={ScheduleType.TEACHER} refreshTrigger={0} />);

    // Check initial week
    expect(screen.getByText(/Dec 15 - Dec 21/i)).toBeInTheDocument();

    // Click next week button
    const nextWeekButton = screen.getByText(/Next Week/i);
    fireEvent.click(nextWeekButton);

    // Wait for the date range to update
    await waitFor(() => expect(screen.getByText(/Dec 22 - Dec 28/i)).toBeInTheDocument());

    // Click previous week button
    const previousWeekButton = screen.getByText(/Previous Week/i);
    fireEvent.click(previousWeekButton);

    // Wait for the date range to revert
    await waitFor(() => expect(screen.getByText(/Dec 15 - Dec 21/i)).toBeInTheDocument());
  });

  test('cancels a one-time class', async () => {
    render(<WeeklySchedule id="123" scheduleType={ScheduleType.TEACHER} refreshTrigger={0} />);

    // Wait for classes to load
    await waitFor(() => expect(screen.getByText('Math 101')).toBeInTheDocument());

    // Simulate canceling a class
    const cancelButton = screen.getByText(/Cancel Meeting/i);
    fireEvent.click(cancelButton);

    // Check if the cancellation UI behavior works (you don't check `fetch`, but ensure UI updates)
    expect(screen.getByText('Canceled')).toBeInTheDocument();
  });

  test('deletes a class', async () => {
    render(<WeeklySchedule id="123" scheduleType={ScheduleType.TEACHER} refreshTrigger={0} />);

    // Wait for classes to load
    await waitFor(() => expect(screen.getByText('Math 101')).toBeInTheDocument());

    // Simulate deleting a class
    const deleteButton = screen.getByText(/Delete Meeting/i);
    fireEvent.click(deleteButton);

    // Check if the UI reflects the deletion (e.g., class no longer in the list)
    expect(screen.queryByText('Math 101')).not.toBeInTheDocument();
  });

  test('displays no classes message when there are no classes for a day', async () => {
    // Mocking empty classes
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce([]),
    });

    render(<WeeklySchedule id="123" scheduleType={ScheduleType.TEACHER} refreshTrigger={0} />);

    // Wait for the empty schedule message
    await waitFor(() => expect(screen.getByText(/No classes/i)).toBeInTheDocument());
  });
});
