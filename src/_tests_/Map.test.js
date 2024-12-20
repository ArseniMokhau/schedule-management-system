import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Map from '../components/Map';
import buildings from '../data/Buildings';

// Mock the buildings data
const mockBuilding = {
  name: 'Building A',
  floors: [
    {
      floorNumber: 1,
      classrooms: [
        { number: '101', status: 'empty' },
        { number: '102', status: 'taken' },
      ],
    },
  ],
};

// Mock the API response
const mockApiResponse = [
  {
    roomNumber: '101',
    recurrenceDay: 0,
    recurrenceStartTime: '08:00:00',
    recurrenceEndTime: '09:00:00',
    teacherName: 'John Doe',
    classTitle: 'Math',
  },
];

describe('Map Component', () => {
  // Mock the global fetch function and the buildings data
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    jest.spyOn(buildings, 'find').mockReturnValue(mockBuilding);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the building name and floor selector', () => {
    render(<Map />);

    // Check if building name and floor button are rendered
    expect(screen.getByText(/Building A/i)).toBeInTheDocument();
    expect(screen.getByText(/Floor 1/i)).toBeInTheDocument();
  });

  test('renders classrooms with correct status', () => {
    render(<Map />);

    // Check if classroom numbers are rendered
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('102')).toBeInTheDocument();

    // Check if the classrooms have the correct status
    expect(screen.getByText('101').closest('div')).toHaveClass('empty');
    expect(screen.getByText('102').closest('div')).toHaveClass('taken');
  });

  test('changes floor and displays the correct classrooms', () => {
    render(<Map />);

    // Simulate changing the floor
    const floorButton = screen.getByText(/Floor 1/i);
    fireEvent.click(floorButton);

    // Check if classrooms of the selected floor are displayed
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('102')).toBeInTheDocument();
  });

  test('fetches and displays class data for the selected date and time', async () => {
    render(<Map />);

    // Wait for the fetch to complete and API response to be processed
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Check if the class data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Math')).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    // Simulate API failure
    global.fetch.mockRejectedValueOnce(new Error('API is down'));

    render(<Map />);

    // Wait for the component to handle the error
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Check if error message is displayed
    expect(screen.getByText(/Failed to fetch classroom data/i)).toBeInTheDocument();
  });

  test('changes the selected time using the time slider', () => {
    render(<Map />);

    // Get the time slider and simulate a change
    const timeSlider = screen.getByLabelText(/Set Time/i);
    fireEvent.change(timeSlider, { target: { value: '600' } }); // 10:00 AM

    // Check if the displayed time is updated
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  test('displays classrooms with the updated status after time change', async () => {
    render(<Map />);

    // Simulate fetching data and setting status
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Check if the classroom status is updated based on the time
    expect(screen.getByText('101').closest('div')).toHaveClass('empty');
    expect(screen.getByText('102').closest('div')).toHaveClass('taken');
  });
});
