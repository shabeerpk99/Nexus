import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';
import { Transaction } from '../../types';

interface DepositFormProps {
  userId: string;
  walletId: string;
  onDepositSuccess?: (transaction: Transaction) => void;
}

export const DepositForm: React.FC<DepositFormProps> = ({
  userId,
  walletId,
  onDepositSuccess,
}) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const paymentMethods = [
    { id: 'credit_card', label: 'Credit Card', icon: '💳' },
    { id: 'debit_card', label: 'Debit Card', icon: '🏦' },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏢' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
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
        type: 'deposit',
        status: 'completed',
        amount: parseFloat(amount),
        currency: 'USD',
        description: description || 'Deposit via ' + paymentMethods.find(m => m.id === paymentMethod)?.label,
        paymentMethodId: `pm${Date.now()}`,
        reference: `TXN-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };

      // Call success callback
      if (onDepositSuccess) {
        onDepositSuccess(newTransaction);
      }

      toast.success(`Deposit of $${parseFloat(amount).toFixed(2)} completed successfully!`);
      setAmount('');
      setDescription('');
    } catch {
      toast.error('Deposit failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Deposit Funds</h3>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <Input
            label="Amount (USD)"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            fullWidth
            startAdornment="$"
            required
          />

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-lg border-2 transition-colors text-center ${
                    paymentMethod === method.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">{method.icon}</div>
                  <p className="text-xs font-medium text-gray-700">{method.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <Input
            label="Description (Optional)"
            placeholder="e.g., Monthly fund allocation"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">💡 Mock Mode:</span> This is a simulation. No actual payment will be processed. The transaction will be marked as completed.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            variant="primary"
            fullWidth
            isLoading={isLoading}
            leftIcon={<CreditCard size={18} />}
            type="submit"
          >
            {isLoading ? 'Processing...' : 'Deposit Now'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
