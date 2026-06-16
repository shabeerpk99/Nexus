import { ConfirmedMeeting } from '../types';

export const confirmedMeetings: ConfirmedMeeting[] = [
  {
    id: 'meeting1',
    participantIds: ['e1', 'i2'],
    title: 'Follow-up Meeting',
    description: 'Discuss business strategy and growth plans',
    date: '2024-02-22',
    startTime: '14:00',
    endTime: '15:00',
    meetingType: 'video',
    location: 'Zoom',
    createdAt: '2024-02-14T09:00:00Z',
    updatedAt: '2024-02-14T09:00:00Z'
  },
  {
    id: 'meeting2',
    participantIds: ['e2', 'i1'],
    title: 'GreenLife Investment Discussion',
    description: 'Discuss scaling and market expansion',
    date: '2024-02-20',
    startTime: '10:00',
    endTime: '11:00',
    meetingType: 'video',
    location: 'Google Meet',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z'
  },
  {
    id: 'meeting3',
    participantIds: ['e3', 'i3'],
    title: 'HealthPulse Initial Pitch',
    description: 'Initial pitch for mental health platform',
    date: '2024-02-25',
    startTime: '11:00',
    endTime: '12:00',
    meetingType: 'video',
    location: 'Zoom',
    createdAt: '2024-02-12T14:00:00Z',
    updatedAt: '2024-02-12T14:00:00Z'
  }
];

// Create a new confirmed meeting
export const createConfirmedMeeting = (
  participantIds: string[],
  title: string,
  description: string,
  date: string,
  startTime: string,
  endTime: string,
  meetingType: 'video' | 'call' | 'in-person' | 'other',
  location?: string,
  notes?: string
): ConfirmedMeeting | null => {
  // Validate participants (at least 2)
  if (participantIds.length < 2) {
    console.error('Meeting must have at least 2 participants.');
    return null;
  }

  // Validate unique participants
  if (new Set(participantIds).size !== participantIds.length) {
    console.error('Duplicate participants not allowed.');
    return null;
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    console.error('Invalid date format. Use YYYY-MM-DD.');
    return null;
  }

  // Validate time format
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    console.error('Invalid time format. Use HH:MM format (24-hour).');
    return null;
  }

  // Validate time range
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startInMinutes = startHour * 60 + startMin;
  const endInMinutes = endHour * 60 + endMin;

  if (startInMinutes >= endInMinutes) {
    console.error('Start time must be before end time.');
    return null;
  }

  const newMeeting: ConfirmedMeeting = {
    id: `meeting${confirmedMeetings.length + 1}`,
    participantIds: [...new Set(participantIds)], // Remove duplicates
    title,
    description,
    date,
    startTime,
    endTime,
    meetingType,
    location,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  confirmedMeetings.push(newMeeting);
  return newMeeting;
};

// Get all confirmed meetings for a user
export const getConfirmedMeetingsForUser = (userId: string): ConfirmedMeeting[] => {
  return confirmedMeetings
    .filter(meeting => meeting.participantIds.includes(userId))
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`).getTime();
      const dateB = new Date(`${b.date}T${b.startTime}`).getTime();
      return dateA - dateB;
    });
};

// Get upcoming meetings for a user
export const getUpcomingMeetingsForUser = (userId: string): ConfirmedMeeting[] => {
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format

  return getConfirmedMeetingsForUser(userId).filter(meeting => {
    // Compare dates
    if (meeting.date > today) return true;
    
    // If same date, compare times
    if (meeting.date === today) {
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const [meetingHour, meetingMin] = meeting.startTime.split(':').map(Number);
      const [currentHour, currentMinute] = currentTime.split(':').map(Number);
      const meetingInMinutes = meetingHour * 60 + meetingMin;
      const currentInMinutes = currentHour * 60 + currentMinute;
      
      return meetingInMinutes > currentInMinutes;
    }
    
    return false;
  });
};

// Get past meetings for a user
export const getPastMeetingsForUser = (userId: string): ConfirmedMeeting[] => {
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format

  return getConfirmedMeetingsForUser(userId).filter(meeting => {
    // Compare dates
    if (meeting.date < today) return true;
    
    // If same date, compare times
    if (meeting.date === today) {
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const [meetingHour, meetingMin] = meeting.startTime.split(':').map(Number);
      const [currentHour, currentMinute] = currentTime.split(':').map(Number);
      const meetingInMinutes = meetingHour * 60 + meetingMin;
      const currentInMinutes = currentHour * 60 + currentMinute;
      
      return meetingInMinutes <= currentInMinutes;
    }
    
    return false;
  }).sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`).getTime();
    const dateB = new Date(`${b.date}T${b.startTime}`).getTime();
    return dateB - dateA; // Most recent first
  });
};

// Get meetings for a specific date
export const getMeetingsForDate = (userId: string, date: string): ConfirmedMeeting[] => {
  return getConfirmedMeetingsForUser(userId).filter(meeting => meeting.date === date);
};

// Get meeting by ID
export const getMeetingById = (meetingId: string): ConfirmedMeeting | null => {
  return confirmedMeetings.find(meeting => meeting.id === meetingId) || null;
};

// Get meetings between two specific users
export const getMeetingsBetweenUsers = (userId1: string, userId2: string): ConfirmedMeeting[] => {
  return confirmedMeetings.filter(
    meeting => meeting.participantIds.includes(userId1) && meeting.participantIds.includes(userId2)
  );
};

// Update a meeting
export const updateConfirmedMeeting = (
  meetingId: string,
  updates: Partial<Omit<ConfirmedMeeting, 'id' | 'participantIds' | 'createdAt'>>
): ConfirmedMeeting | null => {
  const meetingIndex = confirmedMeetings.findIndex(m => m.id === meetingId);
  if (meetingIndex === -1) {
    console.error('Meeting not found.');
    return null;
  }

  // Validate time format if being updated
  if (updates.startTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(updates.startTime)) {
    console.error('Invalid start time format.');
    return null;
  }

  if (updates.endTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(updates.endTime)) {
    console.error('Invalid end time format.');
    return null;
  }

  confirmedMeetings[meetingIndex] = {
    ...confirmedMeetings[meetingIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  return confirmedMeetings[meetingIndex];
};

// Cancel a meeting
export const cancelConfirmedMeeting = (meetingId: string): boolean => {
  const meetingIndex = confirmedMeetings.findIndex(m => m.id === meetingId);
  if (meetingIndex === -1) {
    return false;
  }

  confirmedMeetings.splice(meetingIndex, 1);
  return true;
};

// Get meeting count for a user
export const getConfirmedMeetingsCount = (userId: string): number => {
  return getConfirmedMeetingsForUser(userId).length;
};

// Get upcoming meetings count for a user
export const getUpcomingMeetingsCount = (userId: string): number => {
  return getUpcomingMeetingsForUser(userId).length;
};
