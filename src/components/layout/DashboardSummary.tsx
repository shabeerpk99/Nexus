import React from 'react';
import { Sparkles, ShieldCheck, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';

interface DashboardSummaryProps {
  role: 'entrepreneur' | 'investor';
  userName: string;
}

const summaryItems = {
  entrepreneur: [
    {
      icon: <Sparkles size={18} className="text-primary-600" />,
      title: 'Showcase your startup',
      description: 'Keep your profile up to date with the latest pitch, funding needs, and progress.',
    },
    {
      icon: <Users size={18} className="text-secondary-600" />,
      title: 'Connect with investors',
      description: 'Review inbound collaboration requests and start conversations quickly.',
    },
    {
      icon: <ShieldCheck size={18} className="text-success-600" />,
      title: 'Secure document sharing',
      description: 'Use the Document Chamber to share term sheets and investor materials safely.',
    },
  ],
  investor: [
    {
      icon: <Sparkles size={18} className="text-primary-600" />,
      title: 'Review promising startups',
      description: 'Browse featured startups and filter by industry, traction, and team fit.',
    },
    {
      icon: <Users size={18} className="text-secondary-600" />,
      title: 'Manage your portfolio',
      description: 'Track current opportunities and investment requests in one dashboard.',
    },
    {
      icon: <ShieldCheck size={18} className="text-success-600" />,
      title: 'Streamline deal funding',
      description: 'Fund deals, manage your wallet, and view recent transaction history.',
    },
  ],
};

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ role, userName }) => {
  const items = summaryItems[role];

  return (
    <Card data-tour="demo-checklist">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary-600 uppercase tracking-wide">Demo Ready</p>
            <h2 className="text-2xl font-semibold text-gray-900">Presentation briefing for {userName}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Your demo-ready dashboard highlights the most important actions to show during a walkthrough.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button
              variant="primary"
              onClick={() => window.dispatchEvent(new Event('business-nexus-tour-start'))}
            >
              Start Guided Demo
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.assign('/help')}
            >
              Open Support Guide
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="grid gap-4 sm:grid-cols-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 mb-4">
              {item.icon}
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm leading-6 text-gray-600">{item.description}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};
