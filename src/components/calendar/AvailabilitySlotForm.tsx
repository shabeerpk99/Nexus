import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { AvailabilitySlot } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  hasOverlappingSlot,
  isValidTimeRange,
  validateTimeFormat,
  getAvailabilitySlotsForUser
} from '../../data/availabilitySlots';

interface AvailabilitySlotFormProps {
  userId: string;
  onSlotAdded?: (slot: AvailabilitySlot) => void;
  onSlotUpdated?: (slot: AvailabilitySlot) => void;
  onSlotDeleted?: (slotId: string) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const AvailabilitySlotForm: React.FC<AvailabilitySlotFormProps> = ({
  userId,
  onSlotAdded,
  onSlotUpdated,
  onSlotDeleted
}) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [error, setError] = useState<string | null>(null);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load existing slots
    const userSlots = getAvailabilitySlotsForUser(userId);
    setSlots(userSlots);
  }, [userId]);

  const handleAddSlot = () => {
    setError(null);
    setIsLoading(true);

    try {
      // Validation
      if (!validateTimeFormat(startTime)) {
        setError('Invalid start time format');
        return;
      }

      if (!validateTimeFormat(endTime)) {
        setError('Invalid end time format');
        return;
      }

      if (!isValidTimeRange(startTime, endTime)) {
        setError('Start time must be before end time');
        return;
      }

      if (hasOverlappingSlot(userId, selectedDay, startTime, endTime)) {
        setError('This time slot overlaps with an existing slot');
        return;
      }

      const newSlot = createAvailabilitySlot(userId, selectedDay, startTime, endTime);

      if (newSlot) {
        setSlots([...slots, newSlot]);
        setStartTime('09:00');
        setEndTime('10:00');
        if (onSlotAdded) onSlotAdded(newSlot);
      } else {
        setError('Failed to create availability slot');
      }
    } catch (err) {
      setError('An error occurred while creating the slot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSlot = (slotId: string) => {
    setError(null);

    if (deleteAvailabilitySlot(slotId)) {
      setSlots(slots.filter(slot => slot.id !== slotId));
      if (onSlotDeleted) onSlotDeleted(slotId);
    } else {
      setError('Failed to delete the slot');
    }
  };

  const handleEditSlot = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (slot) {
      setSelectedDay(slot.dayOfWeek);
      setStartTime(slot.startTime);
      setEndTime(slot.endTime);
      setEditingSlotId(slotId);
    }
  };

  const handleUpdateSlot = () => {
    if (!editingSlotId) return;

    setError(null);
    setIsLoading(true);

    try {
      if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
        setError('Invalid time format');
        return;
      }

      if (!isValidTimeRange(startTime, endTime)) {
        setError('Start time must be before end time');
        return;
      }

      const updatedSlot = updateAvailabilitySlot(editingSlotId, {
        dayOfWeek: selectedDay as any,
        startTime,
        endTime
      });

      if (updatedSlot) {
        setSlots(slots.map(slot => (slot.id === editingSlotId ? updatedSlot : slot)));
        setEditingSlotId(null);
        setStartTime('09:00');
        setEndTime('10:00');
        if (onSlotUpdated) onSlotUpdated(updatedSlot);
      } else {
        setError('Failed to update the slot');
      }
    } catch (err) {
      setError('An error occurred while updating the slot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingSlotId(null);
    setSelectedDay('Monday');
    setStartTime('09:00');
    setEndTime('10:00');
    setError(null);
  };

  const slotsForDay = slots.filter(slot => slot.dayOfWeek === selectedDay).sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Add Availability</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-3 flex items-start">
              <AlertCircle size={18} className="text-error-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day of Week
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {DAYS_OF_WEEK.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <Input
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              startAdornment={<Clock size={18} />}
            />

            <Input
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              startAdornment={<Clock size={18} />}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={editingSlotId ? handleUpdateSlot : handleAddSlot}
              isLoading={isLoading}
              leftIcon={editingSlotId ? <Edit2 size={18} /> : <Plus size={18} />}
            >
              {editingSlotId ? 'Update Slot' : 'Add Slot'}
            </Button>

            {editingSlotId && (
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Existing slots for selected day */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{selectedDay} Slots</h3>
          <Badge variant="primary">{slotsForDay.length} slot(s)</Badge>
        </CardHeader>
        <CardBody>
          {slotsForDay.length > 0 ? (
            <div className="space-y-3">
              {slotsForDay.map(slot => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <Clock size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {slot.startTime} - {slot.endTime}
                      </p>
                      <p className="text-sm text-gray-500">{slot.dayOfWeek}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSlot(slot.id)}
                      leftIcon={<Edit2 size={16} />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error-600 hover:text-error-700"
                      onClick={() => handleDeleteSlot(slot.id)}
                      leftIcon={<Trash2 size={16} />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Clock size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No availability slots for {selectedDay}</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* All slots summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">All Availability</h3>
        </CardHeader>
        <CardBody>
          {slots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {DAYS_OF_WEEK.map(day => {
                const daySlots = slots.filter(slot => slot.dayOfWeek === day);
                return (
                  <div key={day} className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm mb-2">{day}</p>
                    {daySlots.length > 0 ? (
                      <div className="space-y-1">
                        {daySlots.map(slot => (
                          <p key={slot.id} className="text-xs text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">No slots</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600">Add your first availability slot above</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
