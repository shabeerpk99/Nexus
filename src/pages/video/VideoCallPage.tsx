import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Video, VideoOff, Mic, MicOff, MonitorPlay, X } from 'lucide-react';

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

export const VideoCallPage: React.FC = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');
  const [error, setError] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const callStartRef = useRef<number | null>(null);

  useEffect(() => {
    const cleanupLocalVideo = localVideoRef.current;
    const cleanupScreenStream = screenStreamRef.current;
    const cleanupLocalStream = localStreamRef.current;

    return () => {
      stopTimer();
      stopTracks(cleanupScreenStream);
      stopTracks(cleanupLocalStream);
      if (cleanupLocalVideo) {
        cleanupLocalVideo.srcObject = null;
      }
      setIsInCall(false);
      setIsScreenSharing(false);
      setCallDuration('00:00');
      callStartRef.current = null;
    };
  }, []);

  const updateDuration = () => {
    if (!callStartRef.current) return;
    const elapsed = Math.floor((Date.now() - callStartRef.current) / 1000);
    setCallDuration(formatDuration(elapsed));
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = window.setInterval(updateDuration, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const bindStreamToVideo = (stream: MediaStream | null) => {
    if (!localVideoRef.current) return;
    localVideoRef.current.srcObject = stream;
  };

  const stopTracks = (stream: MediaStream | null) => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      bindStreamToVideo(stream);
      setIsInCall(true);
      setVideoEnabled(true);
      setAudioEnabled(true);
      setError(null);
      callStartRef.current = Date.now();
      setCallDuration('00:00');
      startTimer();
    } catch {
      setError('Unable to access camera or microphone. Please allow permissions and try again.');
    }
  };

  const stopCall = () => {
    stopTimer();
    stopTracks(screenStreamRef.current);
    stopTracks(localStreamRef.current);
    screenStreamRef.current = null;
    localStreamRef.current = null;
    bindStreamToVideo(null);
    setIsInCall(false);
    setIsScreenSharing(false);
    setCallDuration('00:00');
    callStartRef.current = null;
  };

  const toggleVideo = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !videoEnabled;
    });
    setVideoEnabled((state) => !state);
  };

  const toggleAudio = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !audioEnabled;
    });
    setAudioEnabled((state) => !state);
  };

  const startScreenShare = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setError('Screen sharing is not supported in this browser.');
      return;
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = displayStream;
      bindStreamToVideo(displayStream);
      setIsScreenSharing(true);
      displayStream.getVideoTracks()[0].addEventListener('ended', () => {
        if (isInCall) {
          bindStreamToVideo(localStreamRef.current);
          setIsScreenSharing(false);
        }
      });
      setError(null);
    } catch {
      setError('Screen share request was canceled or blocked.');
    }
  };

  const stopScreenShare = () => {
    stopTracks(screenStreamRef.current);
    screenStreamRef.current = null;
    bindStreamToVideo(localStreamRef.current);
    setIsScreenSharing(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Video Call Room</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Start a secure mock video meeting using the browser media stack.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge variant={isInCall ? 'success' : 'warning'}>
            {isInCall ? 'In Call' : 'Ready to Connect'}
          </Badge>
          <Badge variant="outline">Duration: {callDuration}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.75fr_1fr] gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-medium text-gray-900">Live Preview</h2>
            <p className="text-sm text-gray-500">Your local camera feed and screen share preview.</p>
          </CardHeader>
          <CardBody className="space-y-4">
            {error && (
              <div className="rounded-2xl border border-error-200 bg-error-50 p-3 text-sm text-error-700">
                {error}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-black overflow-hidden aspect-video">
                <video
                  ref={localVideoRef}
                  className="h-full w-full object-cover bg-black"
                  autoPlay
                  playsInline
                  muted
                />
              </div>
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Remote Participant</h3>
                  <p className="text-sm text-gray-500 mt-2">This panel represents the other side of the call in the mock environment.</p>
                </div>
                <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
                  <div className="mb-3 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-2xl font-bold">
                    R
                  </div>
                  <p>Investor / Founder</p>
                  <p className="mt-2 text-xs text-gray-400">Remote stream simulated for demo purposes</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              <Button
                variant={isInCall ? 'error' : 'success'}
                onClick={isInCall ? stopCall : startCall}
                leftIcon={isInCall ? <X size={18} /> : <Video size={18} />}
              >
                {isInCall ? 'End Call' : 'Start Call'}
              </Button>
              <Button
                variant={videoEnabled ? 'primary' : 'outline'}
                onClick={toggleVideo}
                leftIcon={videoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
                disabled={!isInCall}
              >
                {videoEnabled ? 'Video On' : 'Video Off'}
              </Button>
              <Button
                variant={audioEnabled ? 'primary' : 'outline'}
                onClick={toggleAudio}
                leftIcon={audioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                disabled={!isInCall}
              >
                {audioEnabled ? 'Audio On' : 'Audio Off'}
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant={isScreenSharing ? 'outline' : 'secondary'}
                onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                leftIcon={<MonitorPlay size={18} />}
                disabled={!isInCall}
              >
                {isScreenSharing ? 'Stop Share' : 'Share Screen'}
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <h2 className="text-xl font-medium text-gray-900">Call Controls</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-600">Status</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{isInCall ? 'Active session' : 'Not connected'}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-600">Call duration</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{callDuration}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-600">Media settings</p>
                <div className="mt-3 grid gap-3">
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                    <span className="text-sm text-gray-700">Camera</span>
                    <Badge variant={videoEnabled ? 'success' : 'outline'}>{videoEnabled ? 'Enabled' : 'Disabled'}</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                    <span className="text-sm text-gray-700">Microphone</span>
                    <Badge variant={audioEnabled ? 'success' : 'outline'}>{audioEnabled ? 'Enabled' : 'Muted'}</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                    <span className="text-sm text-gray-700">Screen share</span>
                    <Badge variant={isScreenSharing ? 'success' : 'outline'}>{isScreenSharing ? 'Active' : 'Inactive'}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
