import React, { useState } from 'react';
import { TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Deal } from '../../types';

interface DealFundingCardProps {
  deal: Deal;
  onFundClick?: (dealId: string) => void;
}

export const DealFundingCard: React.FC<DealFundingCardProps> = ({
  deal,
  onFundClick,
}) => {
  const fundingPercentage = Math.round((deal.fundingAmount / deal.fundingTarget) * 100);
  const remainingAmount = deal.fundingTarget - deal.fundingAmount;

  const getStatusColor = (status: string): 'success' | 'warning' | 'primary' | 'gray' => {
    switch (status) {
      case 'funded':
        return 'success';
      case 'open':
        return 'primary';
      case 'rejected':
        return 'error';
      default:
        return 'gray';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardBody className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{deal.description}</p>
          </div>
          <Badge variant={getStatusColor(deal.status)}>
            {deal.status === 'funded' && <CheckCircle size={14} className="inline mr-1" />}
            {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
          </Badge>
        </div>

        {/* Equity Info */}
        <div className="bg-primary-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-900">Equity Offering</span>
            <span className="text-lg font-bold text-primary-700">{deal.equity}%</span>
          </div>
        </div>

        {/* Funding Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Funding Progress</span>
            <span className="text-sm font-semibold text-gray-900">{fundingPercentage}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-full transition-all duration-300"
              style={{ width: `${fundingPercentage}%` }}
            />
          </div>

          {/* Funding Details */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              ${deal.fundingAmount.toLocaleString()} of ${deal.fundingTarget.toLocaleString()}
            </span>
            <span className="text-gray-600">
              ${remainingAmount.toLocaleString()} remaining
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-600">Target</p>
            <p className="text-sm font-semibold text-gray-900">
              ${deal.fundingTarget.toLocaleString()} {deal.currency}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-600">Raised</p>
            <p className="text-sm font-semibold text-gray-900">
              ${deal.fundingAmount.toLocaleString()} {deal.currency}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {deal.status === 'open' ? (
          <Button
            variant="primary"
            fullWidth
            leftIcon={<TrendingUp size={18} />}
            onClick={() => onFundClick?.(deal.id)}
          >
            Fund This Deal
          </Button>
        ) : (
          <Button
            variant="outline"
            fullWidth
            disabled
          >
            {deal.status === 'funded' ? '✓ Fully Funded' : 'Deal Closed'}
          </Button>
        )}
      </CardBody>
    </Card>
  );
};
