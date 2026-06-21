import React from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

interface WalletOverviewCardProps {
  balance: number;
  currency: string;
  userRole: string;
}

export const WalletOverviewCard: React.FC<WalletOverviewCardProps> = ({
  balance,
  currency,
  userRole,
}) => {
  const quickActions = [
    {
      id: 'deposit',
      label: 'Deposit',
      icon: <ArrowDownLeft size={18} />,
      color: 'text-success-600',
    },
    {
      id: 'withdraw',
      label: 'Withdraw',
      icon: <ArrowUpRight size={18} />,
      color: 'text-error-600',
    },
    {
      id: 'transfer',
      label: 'Transfer',
      icon: <Send size={18} />,
      color: 'text-info-600',
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
      <CardHeader className="border-b border-primary-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-200 rounded-lg">
            <Wallet size={24} className="text-primary-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary-700">Available Balance</p>
            <h3 className="text-2xl font-bold text-primary-900">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <p className="text-sm font-semibold text-green-600">Active</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Currency</p>
            <p className="text-sm font-semibold text-primary-700">{currency}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Account</p>
            <p className="text-sm font-semibold text-primary-700">
              {userRole === 'entrepreneur' ? 'Business' : 'Investor'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.id}
              to={`/payments?action=${action.id}`}
              className="no-underline"
            >
              <button className="w-full px-3 py-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-colors flex flex-col items-center gap-1">
                <span className={action.color}>{action.icon}</span>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </button>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <Link to="/payments" className="no-underline">
          <Button variant="outline" fullWidth className="mt-2">
            View Payment Center
          </Button>
        </Link>
      </CardBody>
    </Card>
  );
};
