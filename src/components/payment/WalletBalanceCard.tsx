import React from 'react';
import { Wallet } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface WalletBalanceCardProps {
  balance: number;
  currency: string;
  userName: string;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  currency,
  userName,
}) => {
  return (
    <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
      <CardHeader className="border-b border-primary-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm">Wallet Balance</p>
            <p className="text-xs text-primary-200 mt-1">{userName}</p>
          </div>
          <div className="p-3 bg-primary-500 rounded-full">
            <Wallet size={24} />
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="space-y-4">
        <div>
          <p className="text-primary-100 text-sm">Available Balance</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-4xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <Badge variant="primary" className="bg-primary-500 text-white text-xs">
              {currency}
            </Badge>
          </div>
        </div>
        
        <div className="pt-4 border-t border-primary-500">
          <p className="text-primary-200 text-xs">
            Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
