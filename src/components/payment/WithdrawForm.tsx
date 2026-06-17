import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';
import { Transaction } from '../../types';

interface WithdrawFormProps {
  userId: string;
  walletId: string;
  currentBalance: number;
  onWithdrawSuccess?: (transaction: Transaction) => void;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({
  userId,
  walletId,
  currentBalance,
  onWithdrawSuccess,
}) => {
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const withdrawAmount = parseFloat(amount);

    if (!amount || withdrawAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (withdrawAmount > currentBalance) {
      toast.error(`Insufficient balance. Available: $${currentBalance.toFixed(2)}`);
      return;
    }

    if (!bankName.trim()) {
      toast.error('Please enter a bank name');
      return;
    }

    if (!accountNumber.trim()) {
      toast.error('Please enter an account number');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create transaction object
      const newTransaction: Transaction = {
        id: `t${Date.now()}`,
        walletId,
        userId,
        type: 'withdrawal',
        status: 'completed',
        amount: withdrawAmount,
        currency: 'USD',
        description: `Withdrawal to ${bankName} (*${accountNumber.slice(-4)})`,
        reference: `WITHDRAW-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };

      // Call success callback
      if (onWithdrawSuccess) {
        onWithdrawSuccess(newTransaction);
      }

      toast.success(`Withdrawal of $${withdrawAmount.toFixed(2)} initiated successfully!`);
      setAmount('');
      setBankName('');
      setAccountNumber('');
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const maxWithdraw = currentBalance;
  const quickAmounts = [100, 500, 1000, 5000];

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Withdraw Funds</h3>
          <p className="text-sm text-gray-600">
            Balance: <span className="font-semibold">${maxWithdraw.toFixed(2)}</span>
          </p>
        </div>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <Input
              label="Withdrawal Amount (USD)"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              max={maxWithdraw}
              fullWidth
              startAdornment="$"
              required
            />

            {/* Quick Amount Buttons */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-600 w-full mb-1">Quick amounts:</span>
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  disabled={quickAmount > maxWithdraw}
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Bank Name */}
          <Input
            label="Bank Name"
            placeholder="e.g., Chase Bank, Bank of America"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            fullWidth
            required
          />

          {/* Account Number */}
          <Input
            label="Account Number"
            placeholder="Last 4 digits (will be masked)"
            type="password"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            fullWidth
            required
          />

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">💡 Mock Mode:</span> This is a simulation. No actual withdrawal will be processed.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            variant="primary"
            fullWidth
            isLoading={isLoading}
            leftIcon={<ArrowUpRight size={18} />}
            type="submit"
          >
            {isLoading ? 'Processing...' : 'Withdraw Now'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
