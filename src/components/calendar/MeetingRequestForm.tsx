import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, Calendar, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { createMeetingRequest, validateDateFormat, isFutureDate, validateTimeFormat, isValidTimeRange } from '../../data/meetingRequests';
import { User } from '../../types';

interface MeetingRequestFormProps {
  requesterId: string;
  recipient: User;
  initialDate?: string;
  onRequestSent?: () => void;
}

export const MeetingRequestForm: React.FC<MeetingRequestFormProps> = ({
  requesterId,
  recipient,
  initialDate,
  onRequestSent
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proposedDate, setProposedDate] = useState(initialDate ?? '');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialDate) {
      setProposedDate(initialDate);
    }
  }, [initialDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      // Validation
      if (!title.trim()) {
        setError('Meeting title is required');
        return;
      }

      if (!proposedDate) {
        setError('Please select a date');
        return;
      }

      if (!validateDateFormat(proposedDate)) {
        setError('Invalid date format');
        return;
      }

      if (!isFutureDate(proposedDate)) {
        setError('Meeting date must be in the future');
        return;
      }

      if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
        setError('Invalid time format');
        return;
      }

      if (!isValidTimeRange(startTime, endTime)) {
        setError('Start time must be before end time');
        return;
      }

      // Create meeting request
      const request = createMeetingRequest(
        requesterId,
        recipient.id,
        proposedDate,
        startTime,
        endTime,
        title,
        description
      );

      if (request) {
        setSuccess(true);
        setTitle('');
        setDescription('');
        setProposedDate('');
        setStartTime('10:00');
        setEndTime('11:00');
        
        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
        
        if (onRequestSent) onRequestSent();
      } else {
        setError('Failed to send meeting request');
      }
    } catch {
      setError('An error occurred while sending the request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-medium text-gray-900">
          Request Meeting with {recipient.name}
        </h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-3 flex items-start">
              <AlertCircle size={18} className="text-error-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-success-50 border border-success-200 rounded-lg p-3">
              <p className="text-sm text-success-700 font-medium">
                ✓ Meeting request sent successfully!
              </p>
            </div>
          )}

          <Input
            label="Meeting Title"
            placeholder="e.g., Discuss Investment Opportunity"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional details about the meeting..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              rows={3}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Proposed Date"
              type="date"
              value={proposedDate}
              onChange={(e) => setProposedDate(e.target.value)}
              startAdornment={<Calendar size={18} />}
              required
            />

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

          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
            leftIcon={<Send size={18} />}
          >
            Send Meeting Request
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
