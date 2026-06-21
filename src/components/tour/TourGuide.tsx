import React, { useEffect, useMemo, useState } from 'react';
import Joyride, { CallBackProps, Step, STATUS } from 'react-joyride';
import { HelpCircle } from 'lucide-react';
import { Button } from '../ui/Button';

const steps: Step[] = [
  {
    target: '[data-tour="brand"]',
    content: 'Welcome to Business Nexus. This is your brand hub and quick access point to your main dashboard.',
    disableBeacon: true,
  },
  {
    target: '[data-tour="dashboard-link"]',
    content: 'Access your role-specific dashboard here for personalized insights and actions.',
  },
  {
    target: '[data-tour="payments-link"]',
    content: 'Visit the payment center to manage your wallet, deposits, transfers, and deal funding.',
  },
  {
    target: '[data-tour="messages-link"]',
    content: 'Use the Messages section to keep investor and founder conversations in one place.',
  },
  {
    target: '[data-tour="documents-link"]',
    content: 'Store and share documents securely through the Document Chamber and document center.',
  },
  {
    target: '[data-tour="help-link"]',
    content: 'Open Help & Support if you need tutorials, documentation, or direct support.',
  },
  {
    target: '[data-tour="content-area"]',
    content: 'The workspace updates here based on your selected section and page.',
  },
];

export const TourGuide: React.FC = () => {
  const [run, setRun] = useState(false);
  const [isTourComplete, setIsTourComplete] = useState(false);

  const tourSteps = useMemo(() => steps, []);

  useEffect(() => {
    const startTourHandler = () => setRun(true);
    window.addEventListener('business-nexus-tour-start', startTourHandler);
    return () => window.removeEventListener('business-nexus-tour-start', startTourHandler);
  }, []);

  useEffect(() => {
    if (localStorage.getItem('business_nexus_tour_complete') === 'true') {
      setIsTourComplete(true);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      setIsTourComplete(true);
      localStorage.setItem('business_nexus_tour_complete', 'true');
    }
  };

  return (
    <>
      <Joyride
        steps={tourSteps}
        run={run}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#2563EB',
            overlayColor: 'rgba(15, 23, 42, 0.5)',
            textColor: '#111827',
          },
        }}
      />

      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <Button
          variant={isTourComplete ? 'secondary' : 'primary'}
          size="sm"
          leftIcon={<HelpCircle size={16} />}
          onClick={() => setRun(true)}
          aria-label="Start guided walkthrough"
        >
          {isTourComplete ? 'Replay Tour' : 'Start Tour'}
        </Button>
      </div>
    </>
  );
};
