import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import toast from 'react-hot-toast';
import { Transaction, User } from '../../types';

interface TransferFormProps {
  userId: string;
  walletId: string;
  currentBalance: number;
  allUsers: User[];
  onTransferSuccess?: (_transaction: Transaction) => void;
}

export const TransferForm: React.FC<TransferFormProps> = ({
  userId,
  walletId,
  currentBalance,
  allUsers,
  onTransferSuccess,
}) => {
  const [amount, setAmount] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter out current user
  const otherUsers = allUsers.filter(u => u.id !== userId);
  const selectedUser = otherUsers.find(u => u.id === selectedUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transferAmount = parseFloat(amount);

    if (!amount || transferAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (transferAmount > currentBalance) {
      toast.error(`Insufficient balance. Available: $${currentBalance.toFixed(2)}`);
      return;
    }

    if (!selectedUserId) {
      toast.error('Please select a recipient');
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
        type: 'transfer',
        status: 'completed',
        amount: transferAmount,
        currency: 'USD',
        description: description || `Transfer to ${selectedUser?.name}`,
        relatedUserId: selectedUserId,
        reference: `TRF-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };

      // Call success callback
      if (onTransferSuccess) {
        onTransferSuccess(newTransaction);
      }

      toast.success(`Transfer of $${transferAmount.toFixed(2)} to ${selectedUser?.name} completed!`);
      setAmount('');
      setSelectedUserId('');
      setDescription('');
    } catch {
      toast.error('Transfer failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Transfer Funds</h3>
          <p className="text-sm text-gray-600">
            Balance: <span className="font-semibold">${currentBalance.toFixed(2)}</span>
          </p>
        </div>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer To
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select a recipient...</option>
              {otherUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role === 'entrepreneur' ? '🚀' : '💼'})
                </option>
              ))}
            </select>
          </div>

          {/* Selected User Preview */}
          {selectedUser && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatarUrl}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
                <Badge variant={selectedUser.role === 'entrepreneur' ? 'primary' : 'secondary'}>
                  {selectedUser.role === 'entrepreneur' ? 'Entrepreneur' : 'Investor'}
                </Badge>
              </div>
            </div>
          )}

          {/* Amount */}
          <Input
            label="Transfer Amount (USD)"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            max={currentBalance}
            fullWidth
            startAdornment="$"
            required
          />

          {/* Description */}
          <Input
            label="Message (Optional)"
            placeholder="e.g., Deal funding, collaboration payment"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">💡 Mock Mode:</span> This is a simulation. Transfers are instant and funds are immediately available to recipients.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            variant="primary"
            fullWidth
            isLoading={isLoading}
            leftIcon={<Send size={18} />}
            type="submit"
          >
            {isLoading ? 'Processing...' : 'Send Transfer'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
