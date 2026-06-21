import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, Video, Phone, ArrowRight } from 'lucide-react';
import { ConfirmedMeeting } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { findUserById } from '../../data/users';

interface ConfirmedMeetingsWidgetProps {
  meetings: ConfirmedMeeting[];
  currentUserId: string;
  onMeetingClick?: (_meeting: ConfirmedMeeting) => void;
  showViewAll?: boolean;
  limit?: number;
}

export const ConfirmedMeetingsWidget: React.FC<ConfirmedMeetingsWidgetProps> = ({
  meetings,
  currentUserId,
  onMeetingClick,
  showViewAll = true,
  limit = 3
}) => {
  // Sort and limit meetings
  const displayedMeetings = useMemo(() => {
    return meetings
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`).getTime();
        const dateB = new Date(`${b.date}T${b.startTime}`).getTime();
        return dateA - dateB;
      })
      .slice(0, limit);
  }, [meetings, limit]);

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-blue-600" />;
      case 'call':
        return <Phone size={16} className="text-green-600" />;
      case 'in-person':
        return <MapPin size={16} className="text-orange-600" />;
      default:
        return <Calendar size={16} className="text-gray-600" />;
    }
  };

  const getMeetingTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };

  const getOtherParticipants = (meeting: ConfirmedMeeting) => {
    return meeting.participantIds.filter(id => id !== currentUserId);
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Confirmed Meetings</h2>
        <Badge variant="primary">{meetings.length} scheduled</Badge>
      </CardHeader>
      
      <CardBody>
        {displayedMeetings.length > 0 ? (
          <div className="space-y-3">
            {displayedMeetings.map(meeting => {
              const otherParticipants = getOtherParticipants(meeting);
              const firstParticipant = otherParticipants.length > 0 
                ? findUserById(otherParticipants[0])
                : null;

              return (
                <div
                  key={meeting.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer"
                  onClick={() => onMeetingClick?.(meeting)}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Meeting title and type */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {meeting.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getMeetingTypeIcon(meeting.meetingType)}
                        <span className="text-xs text-gray-600">
                          {getMeetingTypeLabel(meeting.meetingType)}
                        </span>
                      </div>
                    </div>

                    {/* Participants count */}
                    <Badge variant="secondary" size="sm">
                      <Users size={14} className="mr-1" />
                      {meeting.participantIds.length}
                    </Badge>
                  </div>

                  {/* Date and time */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{formatDateTime(meeting.date, meeting.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-400" />
                      <span>{meeting.startTime} - {meeting.endTime}</span>
                    </div>
                  </div>

                  {/* Location or meeting details */}
                  {(meeting.location || otherParticipants.length > 0) && (
                    <div className="flex items-center gap-2 mb-3 text-sm">
                      {firstParticipant && (
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={firstParticipant.avatarUrl}
                            alt={firstParticipant.name}
                            size="sm"
                          />
                          <span className="text-gray-700 truncate">
                            {firstParticipant.name}
                            {otherParticipants.length > 1 && ` +${otherParticipants.length - 1}`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description preview */}
                  {meeting.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {meeting.description}
                    </p>
                  )}

                  {/* Location if in-person */}
                  {meeting.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{meeting.location}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No confirmed meetings yet</p>
            <p className="text-sm text-gray-500 mt-1">Send a meeting request to schedule one</p>
          </div>
        )}

        {/* View all button */}
        {showViewAll && meetings.length > limit && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link to="/calendar" className="block">
              <Button
                variant="outline"
                fullWidth
                rightIcon={<ArrowRight size={18} />}
              >
                View All Meetings
              </Button>
            </Link>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
