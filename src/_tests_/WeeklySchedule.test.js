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
    // Mock the user context to simulate logged-in user
    useUser.mockReturnValue(mockUserContext);
  });

  test('renders the weekly schedule and displays classes correctly', async () => {
    render(<WeeklySchedule id="123" scheduleType={ScheduleType.TEACHER} refreshTrigger={0} classes={mockClasses} />);

    // Wait for the classes to load and check if they appear
    await waitFor(() => {
      expect(screen.getByText('Math 101')).toBeInTheDocument();
      expect(screen.getByText('History 101')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('handles no classes scenario', async () => {
    const emptyClasses = [];

    render(<WeeklySchedule id="123" scheduleType={ScheduleType.TEACHER} refreshTrigger={0} classes={emptyClasses} />);

    // Wait for the empty schedule message
    await waitFor(() => {
      expect(screen.getByText(/No classes/i)).toBeInTheDocument();
    });
  });

  test('navigates between weeks', async () => {
    render(<WeeklySchedule id="123" scheduleType={ScheduleType.TEACHER} refreshTrigger={0} classes={mockClasses} />);

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
    render(<WeeklySchedule id="123" scheduleType={ScheduleType.TEACHER} refreshTrigger={0} classes={mockClasses} />);

    // Wait for classes to load
    await waitFor(() => expect(screen.getByText('Math 101')).toBeInTheDocument());

    // Simulate canceling a class
    const cancelButton = screen.getByText(/Cancel Meeting/i);
    fireEvent.click(cancelButton);

    // Check if the cancellation action was triggered (simulating state change)
    expect(screen.getByText(/Class Canceled/i)).toBeInTheDocument(); // You can check the result of the cancellation in UI
  });

  test('deletes a class', async () => {
    render(<WeeklySchedule id="123" scheduleType={ScheduleType.TEACHER} refreshTrigger={0} classes={mockClasses} />);

    // Wait for classes to load
    await waitFor(() => expect(screen.getByText('Math 101')).toBeInTheDocument());

    // Simulate deleting a class
    const deleteButton = screen.getByText(/Delete Meeting/i);
    fireEvent.click(deleteButton);

    // Check if the class is removed from the schedule (you can check UI updates here)
    await waitFor(() => {
      expect(screen.queryByText('Math 101')).not.toBeInTheDocument();
    });
  });
});
