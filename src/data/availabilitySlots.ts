import { AvailabilitySlot } from '../types';

export const availabilitySlots: AvailabilitySlot[] = [
  {
    id: 'slot1',
    userId: 'e1',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '12:00',
    isActive: true,
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 'slot2',
    userId: 'e1',
    dayOfWeek: 'Monday',
    startTime: '14:00',
    endTime: '17:00',
    isActive: true,
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 'slot3',
    userId: 'e1',
    dayOfWeek: 'Wednesday',
    startTime: '10:00',
    endTime: '13:00',
    isActive: true,
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 'slot4',
    userId: 'i1',
    dayOfWeek: 'Tuesday',
    startTime: '09:00',
    endTime: '11:00',
    isActive: true,
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 'slot5',
    userId: 'i1',
    dayOfWeek: 'Thursday',
    startTime: '14:00',
    endTime: '17:00',
    isActive: true,
    createdAt: '2024-02-01T10:00:00Z'
  }
];

// Helper: Validate time format (HH:MM)
export const validateTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Helper: Convert time string to minutes since midnight
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper: Check if two time ranges overlap
export const timesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const startMin1 = timeToMinutes(start1);
  const endMin1 = timeToMinutes(end1);
  const startMin2 = timeToMinutes(start2);
  const endMin2 = timeToMinutes(end2);

  return startMin1 < endMin2 && startMin2 < endMin1;
};

// Helper: Check if a new slot overlaps with existing slots for the same day
export const hasOverlappingSlot = (
  userId: string,
  dayOfWeek: string,
  startTime: string,
  endTime: string,
  excludeSlotId?: string
): boolean => {
  return availabilitySlots.some(slot => 
    slot.userId === userId &&
    slot.dayOfWeek === dayOfWeek &&
    slot.isActive &&
    slot.id !== excludeSlotId &&
    timesOverlap(slot.startTime, slot.endTime, startTime, endTime)
  );
};

// Helper: Validate time range (start < end)
export const isValidTimeRange = (startTime: string, endTime: string): boolean => {
  return timeToMinutes(startTime) < timeToMinutes(endTime);
};

// Get availability slots for a specific user
export const getAvailabilitySlotsForUser = (userId: string): AvailabilitySlot[] => {
  return availabilitySlots.filter(slot => slot.userId === userId && slot.isActive);
};

// Get slots for a specific day
export const getSlotsByDay = (userId: string, dayOfWeek: string): AvailabilitySlot[] => {
  return availabilitySlots.filter(
    slot => slot.userId === userId && slot.dayOfWeek === dayOfWeek && slot.isActive
  );
};

// Create new availability slot with validation
export const createAvailabilitySlot = (
  userId: string,
  dayOfWeek: string,
  startTime: string,
  endTime: string
): AvailabilitySlot | null => {
  // Validate time format
  if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
    console.error('Invalid time format. Use HH:MM format (24-hour).');
    return null;
  }

  // Validate time range
  if (!isValidTimeRange(startTime, endTime)) {
    console.error('Start time must be before end time.');
    return null;
  }

  // Check for overlapping slots
  if (hasOverlappingSlot(userId, dayOfWeek, startTime, endTime)) {
    console.error('This time slot overlaps with an existing slot.');
    return null;
  }

  const newSlot: AvailabilitySlot = {
    id: `slot${availabilitySlots.length + 1}`,
    userId,
    dayOfWeek: dayOfWeek as any,
    startTime,
    endTime,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  availabilitySlots.push(newSlot);
  return newSlot;
};

// Update availability slot with validation
export const updateAvailabilitySlot = (
  slotId: string,
  updates: Partial<Omit<AvailabilitySlot, 'id' | 'userId' | 'createdAt'>>
): AvailabilitySlot | null => {
  const slotIndex = availabilitySlots.findIndex(slot => slot.id === slotId);
  if (slotIndex === -1) {
    console.error('Slot not found.');
    return null;
  }

  const slot = availabilitySlots[slotIndex];

  // If time is being updated, validate
  const startTime = updates.startTime || slot.startTime;
  const endTime = updates.endTime || slot.endTime;
  const dayOfWeek = updates.dayOfWeek || slot.dayOfWeek;

  // Validate time format
  if (updates.startTime && !validateTimeFormat(updates.startTime)) {
    console.error('Invalid start time format.');
    return null;
  }
  if (updates.endTime && !validateTimeFormat(updates.endTime)) {
    console.error('Invalid end time format.');
    return null;
  }

  // Validate time range
  if (!isValidTimeRange(startTime, endTime)) {
    console.error('Start time must be before end time.');
    return null;
  }

  // Check for overlapping slots (excluding current slot)
  if (hasOverlappingSlot(slot.userId, dayOfWeek, startTime, endTime, slotId)) {
    console.error('This time slot overlaps with an existing slot.');
    return null;
  }

  availabilitySlots[slotIndex] = {
    ...slot,
    ...updates
  };

  return availabilitySlots[slotIndex];
};

// Delete availability slot
export const deleteAvailabilitySlot = (slotId: string): boolean => {
  const slotIndex = availabilitySlots.findIndex(slot => slot.id === slotId);
  if (slotIndex === -1) {
    return false;
  }

  availabilitySlots[slotIndex].isActive = false;
  return true;
};

// Get slot by ID
export const getSlotById = (slotId: string): AvailabilitySlot | null => {
  return availabilitySlots.find(slot => slot.id === slotId) || null;
};

// Check if user is available at a specific time
export const isUserAvailable = (
  userId: string,
  dayOfWeek: string,
  startTime: string,
  endTime: string
): boolean => {
  const userSlots = getAvailabilitySlotsForUser(userId);
  
  // Check if the requested time falls within any of the user's availability slots
  return userSlots.some(slot => 
    slot.dayOfWeek === dayOfWeek &&
    timeToMinutes(slot.startTime) <= timeToMinutes(startTime) &&
    timeToMinutes(slot.endTime) >= timeToMinutes(endTime)
  );
};
