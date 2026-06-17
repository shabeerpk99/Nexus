import { Transaction } from '../types';

export const transactions: Transaction[] = [
  {
    id: 't1',
    walletId: 'w1',
    userId: 'i1',
    type: 'deposit',
    status: 'completed',
    amount: 50000.00,
    currency: 'USD',
    description: 'Initial deposit via wire transfer',
    paymentMethodId: 'pm2',
    reference: 'TXN-2024-001',
    createdAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T10:45:00Z',
  },
  {
    id: 't2',
    walletId: 'w1',
    userId: 'i1',
    type: 'investment',
    status: 'completed',
    amount: 500000.00,
    currency: 'USD',
    description: 'Investment in TechWave AI',
    dealId: 'd1',
    relatedUserId: 'e1',
    reference: 'DEAL-001',
    createdAt: '2024-02-01T14:20:00Z',
    completedAt: '2024-02-01T14:22:00Z',
  },
  {
    id: 't3',
    walletId: 'w1',
    userId: 'i1',
    type: 'deposit',
    status: 'completed',
    amount: 75000.50,
    currency: 'USD',
    description: 'Additional funding deposit',
    paymentMethodId: 'pm1',
    reference: 'TXN-2024-002',
    createdAt: '2024-02-10T09:15:00Z',
    completedAt: '2024-02-10T09:20:00Z',
  },
  {
    id: 't4',
    walletId: 'w2',
    userId: 'e1',
    type: 'payout',
    status: 'completed',
    amount: 45000.00,
    currency: 'USD',
    description: 'Business profit withdrawal',
    paymentMethodId: 'pm3',
    reference: 'PAYOUT-001',
    createdAt: '2024-02-15T11:00:00Z',
    completedAt: '2024-02-15T11:05:00Z',
  },
  {
    id: 't5',
    walletId: 'w1',
    userId: 'i1',
    type: 'transfer',
    status: 'completed',
    amount: 25000.00,
    currency: 'USD',
    description: 'Transfer to Jennifer Lee for deal coordination',
    relatedUserId: 'i2',
    reference: 'TRF-001',
    createdAt: '2024-02-20T13:30:00Z',
    completedAt: '2024-02-20T13:35:00Z',
  },
  {
    id: 't6',
    walletId: 'w2',
    userId: 'e1',
    type: 'deposit',
    status: 'completed',
    amount: 10000.00,
    currency: 'USD',
    description: 'Revenue from services',
    reference: 'TXN-2024-003',
    createdAt: '2024-02-22T15:45:00Z',
    completedAt: '2024-02-22T15:50:00Z',
  },
  {
    id: 't7',
    walletId: 'w3',
    userId: 'i2',
    type: 'deposit',
    status: 'completed',
    amount: 100000.00,
    currency: 'USD',
    description: 'Monthly fund allocation',
    reference: 'FUND-001',
    createdAt: '2024-02-01T08:00:00Z',
    completedAt: '2024-02-01T08:05:00Z',
  },
  {
    id: 't8',
    walletId: 'w4',
    userId: 'e2',
    type: 'withdrawal',
    status: 'completed',
    amount: 5000.00,
    currency: 'USD',
    description: 'Operational expense withdrawal',
    reference: 'WITHDRAW-001',
    createdAt: '2024-02-18T10:20:00Z',
    completedAt: '2024-02-18T10:25:00Z',
  },
];

// Helper functions
export const getTransactionsByUserId = (userId: string): Transaction[] => {
  return transactions.filter(t => t.userId === userId);
};

export const getTransactionsByWalletId = (walletId: string): Transaction[] => {
  return transactions.filter(t => t.walletId === walletId);
};

export const getRecentTransactions = (userId: string, limit: number = 5): Transaction[] => {
  return getTransactionsByUserId(userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getTransactionsByType = (userId: string, type: string): Transaction[] => {
  return getTransactionsByUserId(userId).filter(t => t.type === type);
};

export const calculateTotalDeposits = (userId: string): number => {
  return getTransactionsByType(userId, 'deposit')
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalWithdrawals = (userId: string): number => {
  return getTransactionsByType(userId, 'withdrawal')
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalInvested = (userId: string): number => {
  return getTransactionsByType(userId, 'investment')
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const addTransaction = (transaction: Transaction): void => {
  transactions.push(transaction);
};
