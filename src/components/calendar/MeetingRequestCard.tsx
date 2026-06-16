import React, { useState } from 'react';
import { Calendar, Clock, User, MessageCircle, Check, X, AlertCircle } from 'lucide-react';
import { MeetingRequest } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import {
  acceptMeetingRequest,
  declineMeetingRequest,
  cancelMeetingRequest
} from '../../data/meetingRequests';
import { findUserById } from '../../data/users';

interface MeetingRequestCardProps {
  request: MeetingRequest;
  currentUserId: string;
  onStatusChange?: (request: MeetingRequest) => void;
}

export const MeetingRequestCard: React.FC<MeetingRequestCardProps> = ({
  request,
  currentUserId,
  onStatusChange
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRequester = request.requesterId === currentUserId;
  const otherUser = isRequester
    ? findUserById(request.recipientId)
    : findUserById(request.requesterId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'accent';
      case 'accepted':
        return 'success';
      case 'declined':
        return 'error';
      case 'cancelled':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleAccept = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const updated = acceptMeetingRequest(request.id);
      if (updated && onStatusChange) {
        onStatusChange(updated);
      } else {
        setError('Failed to accept meeting request');
      }
    } catch (err) {
      setError('An error occurred while accepting the request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const updated = declineMeetingRequest(request.id);
      if (updated && onStatusChange) {
        onStatusChange(updated);
      } else {
        setError('Failed to decline meeting request');
      }
    } catch (err) {
      setError('An error occurred while declining the request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const updated = cancelMeetingRequest(request.id);
      if (updated && onStatusChange) {
        onStatusChange(updated);
      } else {
        setError('Failed to cancel meeting request');
      }
    } catch (err) {
      setError('An error occurred while cancelling the request');
    } finally {
      setIsLoading(false);
    }
  };

  if (!otherUser) {
    return null;
  }

  return (
    <Card className={`border-l-4 ${
      request.status === 'pending'
        ? 'border-l-accent-500 bg-accent-50'
        : request.status === 'accepted'
        ? 'border-l-success-500 bg-success-50'
        : 'border-l-gray-300'
    }`}>
      <CardBody className="p-4">
        {error && (
          <div className="mb-4 bg-error-50 border border-error-200 rounded-lg p-3 flex items-start">
            <AlertCircle size={18} className="text-error-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-error-700">{error}</p>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          {/* Left section - User info and meeting details */}
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            <Avatar
              src={otherUser.avatarUrl}
              alt={otherUser.name}
              size="md"
              status={otherUser.isOnline ? 'online' : 'offline'}
              className="flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              {/* Header with user name and status */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-medium text-gray-900 truncate">
                  {isRequester ? 'Your request to' : 'Request from'} {otherUser.name}
                </h3>
                <Badge variant={getStatusColor(request.status)} size="sm">
                  {getStatusLabel(request.status)}
                </Badge>
              </div>

              {/* Meeting title */}
              <p className="text-sm font-medium text-gray-900 mb-2">
                {request.title}
              </p>

              {/* Description */}
              {request.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {request.description}
                </p>
              )}

              {/* Meeting details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    {new Date(request.proposedDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    {request.proposedStartTime} - {request.proposedEndTime}
                  </span>
                </div>

                {request.respondedAt && (
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} className="text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      {new Date(request.respondedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* User role info */}
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400" />
                <p className="text-xs text-gray-500 capitalize">
                  {otherUser.role} • {otherUser.email}
                </p>
              </div>
            </div>
          </div>

          {/* Right section - Action buttons */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {request.status === 'pending' && !isRequester && (
              <>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  isLoading={isLoading}
                  leftIcon={<Check size={16} />}
                  className="min-w-max"
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDecline}
                  isLoading={isLoading}
                  leftIcon={<X size={16} />}
                  className="min-w-max"
                >
                  Decline
                </Button>
              </>
            )}

            {request.status === 'pending' && isRequester && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                isLoading={isLoading}
                leftIcon={<X size={16} />}
                className="min-w-max"
              >
                Cancel Request
              </Button>
            )}

            {request.status === 'accepted' && (
              <Badge variant="success" className="text-center py-1">
                <Check size={14} className="mr-1" />
                Meeting Confirmed
              </Badge>
            )}

            {request.status === 'declined' && (
              <Badge variant="error" className="text-center py-1">
                Declined
              </Badge>
            )}

            {request.status === 'cancelled' && (
              <Badge variant="gray" className="text-center py-1">
                Cancelled
              </Badge>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
