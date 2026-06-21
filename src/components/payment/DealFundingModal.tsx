import React, { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import toast from 'react-hot-toast';
import { Deal, Transaction } from '../../types';

interface DealFundingModalProps {
  deal: Deal;
  isOpen: boolean;
  userBalance: number;
  onClose: () => void;
  onFundingSuccess?: (transaction: Transaction) => void;
}

export const DealFundingModal: React.FC<DealFundingModalProps> = ({
  deal,
  isOpen,
  userBalance,
  onClose,
  onFundingSuccess,
}) => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const remainingTarget = deal.fundingTarget - deal.fundingAmount;
  const maxInvestment = Math.min(userBalance, remainingTarget);

  const handleFunding = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(investmentAmount);

    if (!investmentAmount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > userBalance) {
      toast.error(`Insufficient balance. Available: $${userBalance.toFixed(2)}`);
      return;
    }

    if (amount > remainingTarget) {
      toast.error(`Cannot invest more than remaining target: $${remainingTarget.toFixed(2)}`);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create transaction
      const transaction: Transaction = {
        id: `t${Date.now()}`,
        walletId: `w${Date.now()}`,
        userId: `i${Date.now()}`,
        type: 'investment',
        status: 'completed',
        amount,
        currency: 'USD',
        description: `Investment in ${deal.title}`,
        dealId: deal.id,
        relatedUserId: deal.entrepreneurId,
        reference: `INVEST-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };

      if (onFundingSuccess) {
        onFundingSuccess(transaction);
      }

      toast.success(`Successfully invested $${amount.toFixed(2)} in ${deal.title}!`);
      setInvestmentAmount('');
      onClose();
    } catch {
      toast.error('Investment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Fund Deal</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Deal Summary */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-gray-900">{deal.title}</h3>
            <p className="text-sm text-gray-600">{deal.description}</p>
            
            <div className="pt-2 border-t border-primary-200 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Equity Offering:</span>
                <Badge variant="primary">{deal.equity}%</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Remaining:</span>
                <span className="font-semibold text-primary-700">
                  ${remainingTarget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Investment Form */}
          <form onSubmit={handleFunding} className="space-y-4">
            {/* Investment Amount */}
            <Input
              label="Investment Amount (USD)"
              type="number"
              placeholder="0.00"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              min="0"
              step="0.01"
              max={maxInvestment}
              fullWidth
              startAdornment="$"
              required
            />

            {/* Quick Amount Buttons */}
            <div className="space-y-2">
              <span className="text-xs text-gray-600">Quick amounts:</span>
              <div className="flex flex-wrap gap-2">
                {[10000, 25000, 50000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setInvestmentAmount(Math.min(amount, maxInvestment).toString())}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    disabled={amount > maxInvestment}
                  >
                    ${amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Summary */}
            {investmentAmount && (
              <div className="bg-success-50 border border-success-200 rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium text-success-900">Investment Summary</p>
                <div className="space-y-1 text-sm text-success-800">
                  <div className="flex justify-between">
                    <span>Investment Amount:</span>
                    <span className="font-semibold">${parseFloat(investmentAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Equity Share:</span>
                    <span className="font-semibold">
                      {((parseFloat(investmentAmount) / deal.fundingTarget) * deal.equity).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Balance:</span>
                    <span className="font-semibold">
                      ${(userBalance - parseFloat(investmentAmount)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">💡 Mock Mode:</span> This is a simulation. Investment will be recorded but no actual funds are transferred.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                fullWidth
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                isLoading={isLoading}
                leftIcon={<TrendingUp size={18} />}
                type="submit"
              >
                {isLoading ? 'Processing...' : 'Invest Now'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
