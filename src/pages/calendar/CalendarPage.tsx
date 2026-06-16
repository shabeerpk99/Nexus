import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '../../components/calendar/Calendar';
import { AvailabilitySlotForm } from '../../components/calendar/AvailabilitySlotForm';
import { MeetingRequestForm } from '../../components/calendar/MeetingRequestForm';
import { MeetingRequestCard } from '../../components/calendar/MeetingRequestCard';
import { ConfirmedMeetingsWidget } from '../../components/calendar/ConfirmedMeetingsWidget';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { getConfirmedMeetingsForUser } from '../../data/confirmedMeetings';
import { getReceivedMeetingRequests, getSentMeetingRequests, MeetingRequest } from '../../data/meetingRequests';
import { findUserById } from '../../data/users';

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirmedMeetings, setConfirmedMeetings] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<MeetingRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<MeetingRequest[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load meetings and requests
    const meetings = getConfirmedMeetingsForUser(user.id);
    setConfirmedMeetings(meetings);

    const received = getReceivedMeetingRequests(user.id);
    setReceivedRequests(received);

    const sent = getSentMeetingRequests(user.id);
    setSentRequests(sent);
  }, [user, navigate]);

  if (!user) return null;

  // Get potential recipients (other users)
  const potentialRecipients = [
    findUserById('e1'),
    findUserById('e2'),
    findUserById('e3'),
    findUserById('i1'),
    findUserById('i2'),
    findUserById('i3')
  ].filter((u) => u && u.id !== user.id);

  const pendingReceivedCount = receivedRequests.filter(r => r.status === 'pending').length;
  const pendingSentCount = sentRequests.filter(r => r.status === 'pending').length;

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedRecipient(null);
    setActiveTab('calendar');
  };

  const handleRequestStatusChange = (updatedRequest: MeetingRequest) => {
    if (updatedRequest.requesterId === user.id) {
      setSentRequests(sentRequests.map(r => r.id === updatedRequest.id ? updatedRequest : r));
    } else {
      setReceivedRequests(receivedRequests.map(r => r.id === updatedRequest.id ? updatedRequest : r));
    }

    // Refresh confirmed meetings if the request was accepted
    if (updatedRequest.status === 'accepted') {
      const meetings = getConfirmedMeetingsForUser(user.id);
      setConfirmedMeetings(meetings);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meeting Scheduler</h1>
        <p className="text-gray-600 mt-1">Manage your availability and schedule meetings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">
            <CalendarIcon size={18} className="mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="availability">
            <Clock size={18} className="mr-2" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="requests">
            <Send size={18} className="mr-2" />
            Requests
            {(pendingReceivedCount + pendingSentCount) > 0 && (
              <Badge variant="error" size="sm" className="ml-2">
                {pendingReceivedCount + pendingSentCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <CalendarIcon size={18} className="mr-2" />
            Meetings
            {confirmedMeetings.length > 0 && (
              <Badge variant="primary" size="sm" className="ml-2">
                {confirmedMeetings.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-medium text-gray-900">Your Meeting Calendar</h2>
            </CardHeader>
            <CardBody>
              <Calendar
                meetings={confirmedMeetings}
                onDateSelect={handleDateSelect}
                onEventClick={(meeting) => {
                  setSelectedDate(meeting.date);
                  setActiveTab('meetings');
                }}
              />
            </CardBody>
          </Card>
          {selectedDate && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Add Meeting on {selectedDate}</h3>
                    <p className="text-sm text-gray-500">Choose recipient and submit a request for the selected date.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedDate(null)}>
                    Clear selection
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Select Recipient</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {potentialRecipients.map(recipient => (
                        <Button
                          key={recipient.id}
                          variant={selectedRecipient?.id === recipient.id ? 'primary' : 'outline'}
                          onClick={() => setSelectedRecipient(recipient)}
                          fullWidth
                        >
                          {recipient.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedRecipient && (
                    <div className="lg:col-span-2">
                      <MeetingRequestForm
                        requesterId={user.id}
                        recipient={selectedRecipient}
                        initialDate={selectedDate}
                        onRequestSent={() => {
                          const sent = getSentMeetingRequests(user.id);
                          setSentRequests(sent);
                          setSelectedRecipient(null);
                          setSelectedDate(null);
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <AvailabilitySlotForm
            userId={user.id}
            onSlotAdded={() => {}}
            onSlotUpdated={() => {}}
            onSlotDeleted={() => {}}
          />
        </TabsContent>

        {/* Meeting Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Received Requests */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Received Requests</h2>
                  {pendingReceivedCount > 0 && (
                    <Badge variant="accent">{pendingReceivedCount} pending</Badge>
                  )}
                </CardHeader>
                <CardBody>
                  {receivedRequests.length > 0 ? (
                    <div className="space-y-3">
                      {receivedRequests.map(request => (
                        <MeetingRequestCard
                          key={request.id}
                          request={request}
                          currentUserId={user.id}
                          onStatusChange={handleRequestStatusChange}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Send size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600">No meeting requests yet</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Sent Requests */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Sent Requests</h2>
                  {pendingSentCount > 0 && (
                    <Badge variant="accent">{pendingSentCount} pending</Badge>
                  )}
                </CardHeader>
                <CardBody>
                  {sentRequests.length > 0 ? (
                    <div className="space-y-3">
                      {sentRequests.map(request => (
                        <MeetingRequestCard
                          key={request.id}
                          request={request}
                          currentUserId={user.id}
                          onStatusChange={handleRequestStatusChange}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Send size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600">No outgoing requests</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Browse and send requests below
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Send New Request */}
          {selectedRecipient ? (
            <MeetingRequestForm
              requesterId={user.id}
              recipient={selectedRecipient}
              onRequestSent={() => {
                const sent = getSentMeetingRequests(user.id);
                setSentRequests(sent);
                setSelectedRecipient(null);
              }}
            />
          ) : (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Send New Request</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 mb-4">Select a user to send a meeting request</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {potentialRecipients.map(recipient => (
                    <Button
                      key={recipient!.id}
                      variant="outline"
                      onClick={() => setSelectedRecipient(recipient)}
                      fullWidth
                    >
                      {recipient!.name}
                    </Button>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </TabsContent>

        {/* Confirmed Meetings Tab */}
        <TabsContent value="meetings" className="space-y-6">
          <ConfirmedMeetingsWidget
            meetings={confirmedMeetings}
            currentUserId={user.id}
            limit={10}
            showViewAll={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
