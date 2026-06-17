import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Send, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Transaction } from '../../types';

interface TransactionHistoryTableProps {
  transactions: Transaction[];
  limit?: number;
}

export const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({
  transactions,
  limit = 10,
}) => {
  const displayTransactions = transactions.slice(0, limit);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft size={18} className="text-success-600" />;
      case 'withdrawal':
      case 'payout':
        return <ArrowUpRight size={18} className="text-error-600" />;
      case 'transfer':
        return <Send size={18} className="text-info-600" />;
      case 'investment':
        return <TrendingUp size={18} className="text-primary-600" />;
      default:
        return <TrendingUp size={18} className="text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-success-600" />;
      case 'pending':
        return <Clock size={16} className="text-warning-600" />;
      case 'failed':
        return <XCircle size={16} className="text-error-600" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string): 'success' | 'warning' | 'error' | 'gray' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'gray';
    }
  };

  const getTypeLabel = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (displayTransactions.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No transactions yet</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
      </CardHeader>
      
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Description</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {displayTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      <span className="font-medium text-gray-900">
                        {getTypeLabel(transaction.type)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <p className="text-gray-600 truncate max-w-xs">{transaction.description}</p>
                    {transaction.reference && (
                      <p className="text-gray-400 text-xs mt-1">{transaction.reference}</p>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`font-semibold ${
                        transaction.type === 'deposit' || transaction.type === 'payout'
                          ? (transaction.type === 'deposit' ? 'text-success-600' : 'text-error-600')
                          : 'text-gray-900'
                      }`}>
                        {transaction.type === 'withdrawal' || transaction.type === 'transfer' || transaction.type === 'investment' || transaction.type === 'payout'
                          ? '-'
                          : '+'}
                        ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-gray-500 text-xs">{transaction.currency}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      <Badge variant={getStatusBadgeVariant(transaction.status)} size="sm">
                        {transaction.status}
                      </Badge>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};
