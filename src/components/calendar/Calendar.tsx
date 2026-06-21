import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ConfirmedMeeting } from '../../types';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';

interface CalendarProps {
  meetings: ConfirmedMeeting[];
  onDateSelect?: (_date: string) => void;
  onEventClick?: (_meeting: ConfirmedMeeting) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ meetings, onDateSelect, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const totalDays = daysInMonth(currentDate);
  const firstDay = firstDayOfMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getMeetingsForDate = (day: number) => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return meetingDate.getDate() === day &&
             meetingDate.getMonth() === currentDate.getMonth() &&
             meetingDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">{monthName}</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousMonth}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextMonth}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardBody>
        <div className="space-y-4">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayMeetings = day ? getMeetingsForDate(day) : [];
              return (
                <div
                  key={index}
                  className="aspect-square border border-gray-200 rounded-lg p-1 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    if (day && onDateSelect) {
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      onDateSelect(date.toISOString().split('T')[0]);
                    }
                  }}
                >
                  <div className="h-full flex flex-col">
                    {day && (
                      <>
                        <div className="text-sm font-medium text-gray-900">{day}</div>
                        <div className="flex-1 overflow-y-auto">
                          {dayMeetings.slice(0, 2).map(meeting => (
                            <div
                              key={meeting.id}
                              className="text-xs bg-primary-100 text-primary-700 px-1 py-0.5 rounded mb-0.5 truncate cursor-pointer hover:bg-primary-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onEventClick) onEventClick(meeting);
                              }}
                              title={meeting.title}
                            >
                              {meeting.title}
                            </div>
                          ))}
                          {dayMeetings.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayMeetings.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
