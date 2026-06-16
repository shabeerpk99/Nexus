import { MeetingRequest } from '../types';
import { createConfirmedMeeting } from './confirmedMeetings';

export const meetingRequests: MeetingRequest[] = [
  {
    id: 'req1',
    requesterId: 'i1',
    recipientId: 'e1',
    proposedDate: '2024-02-20',
    proposedStartTime: '10:00',
    proposedEndTime: '11:00',
    title: 'Discuss TechWave AI Investment',
    description: 'Initial discussion about investment opportunity in TechWave AI',
    status: 'pending',
    createdAt: '2024-02-15T14:00:00Z'
  },
  {
    id: 'req2',
    requesterId: 'e1',
    recipientId: 'i2',
    proposedDate: '2024-02-22',
    proposedStartTime: '14:00',
    proposedEndTime: '15:00',
    title: 'Follow-up Meeting',
    description: 'Discuss business strategy and growth plans',
    status: 'accepted',
    createdAt: '2024-02-14T09:00:00Z',
    respondedAt: '2024-02-14T10:30:00Z',
    meetingId: 'meeting1'
  },
  {
    id: 'req3',
    requesterId: 'i3',
    recipientId: 'e3',
    proposedDate: '2024-02-25',
    proposedStartTime: '11:00',
    proposedEndTime: '12:00',
    title: 'HealthPulse Investment Discussion',
    description: 'Discuss mental health tech investment',
    status: 'declined',
    createdAt: '2024-02-13T11:00:00Z',
    respondedAt: '2024-02-13T13:00:00Z'
  }
];

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const validateDateFormat = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

export const isFutureDate = (date: string): boolean => {
  const givenDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return givenDate.setHours(0, 0, 0, 0) >= today.getTime();
};

export const validateTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
};

export const isValidTimeRange = (startTime: string, endTime: string): boolean => {
  if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
    return false;
  }
  return timeToMinutes(endTime) > timeToMinutes(startTime);
};

export const getReceivedMeetingRequests = (userId: string): MeetingRequest[] => {
  return meetingRequests
    .filter(req => req.recipientId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getSentMeetingRequests = (userId: string): MeetingRequest[] => {
  return meetingRequests
    .filter(req => req.requesterId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getPendingMeetingRequests = (userId: string): MeetingRequest[] => {
  return meetingRequests.filter(
    req => req.recipientId === userId && req.status === 'pending'
  );
};

export const getMeetingRequestsBetweenUsers = (
  userId1: string,
  userId2: string
): MeetingRequest[] => {
  return meetingRequests.filter(
    req =>
      (req.requesterId === userId1 && req.recipientId === userId2) ||
      (req.requesterId === userId2 && req.recipientId === userId1)
  );
};

export const createMeetingRequest = (
  requesterId: string,
  recipientId: string,
  proposedDate: string,
  proposedStartTime: string,
  proposedEndTime: string,
  title: string,
  description: string
): MeetingRequest | null => {
  if (!validateDateFormat(proposedDate)) {
    console.error('Invalid date format. Use YYYY-MM-DD.');
    return null;
  }

  if (!isFutureDate(proposedDate)) {
    console.error('Meeting date must be in the future.');
    return null;
  }

  if (!validateTimeFormat(proposedStartTime) || !validateTimeFormat(proposedEndTime)) {
    console.error('Invalid time format. Use HH:MM format (24-hour).');
    return null;
  }

  if (!isValidTimeRange(proposedStartTime, proposedEndTime)) {
    console.error('Start time must be before end time.');
    return null;
  }

  const existingRequest = meetingRequests.find(
    req =>
      req.requesterId === requesterId &&
      req.recipientId === recipientId &&
      req.status === 'pending'
  );

  if (existingRequest) {
    console.error('You already have a pending meeting request with this user.');
    return null;
  }

  if (requesterId === recipientId) {
    console.error('You cannot create a meeting request with yourself.');
    return null;
  }

  const newRequest: MeetingRequest = {
    id: `req${meetingRequests.length + 1}`,
    requesterId,
    recipientId,
    proposedDate,
    proposedStartTime,
    proposedEndTime,
    title,
    description,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  meetingRequests.push(newRequest);
  return newRequest;
};

export const acceptMeetingRequest = (requestId: string): MeetingRequest | null => {
  const requestIndex = meetingRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    console.error('Meeting request not found.');
    return null;
  }

  const request = meetingRequests[requestIndex];
  if (request.status !== 'pending') {
    console.error('Only pending requests can be accepted.');
    return null;
  }

  const confirmedMeeting = createConfirmedMeeting(
    [request.requesterId, request.recipientId],
    request.title,
    request.description,
    request.proposedDate,
    request.proposedStartTime,
    request.proposedEndTime,
    'video'
  );

  if (!confirmedMeeting) {
    console.error('Failed to create confirmed meeting.');
    return null;
  }

  meetingRequests[requestIndex] = {
    ...request,
    status: 'accepted',
    respondedAt: new Date().toISOString(),
    meetingId: confirmedMeeting.id
  };

  return meetingRequests[requestIndex];
};

export const declineMeetingRequest = (requestId: string): MeetingRequest | null => {
  const requestIndex = meetingRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    console.error('Meeting request not found.');
    return null;
  }

  const request = meetingRequests[requestIndex];
  if (request.status !== 'pending') {
    console.error('Only pending requests can be declined.');
    return null;
  }

  meetingRequests[requestIndex] = {
    ...request,
    status: 'declined',
    respondedAt: new Date().toISOString()
  };

  return meetingRequests[requestIndex];
};

export const cancelMeetingRequest = (requestId: string): MeetingRequest | null => {
  const requestIndex = meetingRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    console.error('Meeting request not found.');
    return null;
  }

  const request = meetingRequests[requestIndex];
  if (request.status !== 'pending') {
    console.error('Only pending requests can be cancelled.');
    return null;
  }

  meetingRequests[requestIndex] = {
    ...request,
    status: 'cancelled',
    respondedAt: new Date().toISOString()
  };

  return meetingRequests[requestIndex];
};

export const getMeetingRequestById = (requestId: string): MeetingRequest | null => {
  return meetingRequests.find(req => req.id === requestId) || null;
};

export const getPendingRequestsCount = (userId: string): number => {
  return meetingRequests.filter(
    req => req.recipientId === userId && req.status === 'pending'
  ).length;
};
