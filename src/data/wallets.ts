import { Wallet, PaymentMethod } from '../types';

// Mock payment methods
const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm1',
    userId: 'i1',
    type: 'credit_card',
    provider: 'Visa',
    last4: '4242',
    expiryDate: '12/25',
    isDefault: true,
    createdAt: '2023-01-15T09:24:00Z',
  },
  {
    id: 'pm2',
    userId: 'i1',
    type: 'bank_transfer',
    provider: 'Chase Bank',
    last4: '6789',
    isDefault: false,
    createdAt: '2023-02-15T09:24:00Z',
  },
  {
    id: 'pm3',
    userId: 'e1',
    type: 'credit_card',
    provider: 'Mastercard',
    last4: '5555',
    expiryDate: '08/26',
    isDefault: true,
    createdAt: '2023-03-15T09:24:00Z',
  },
];

// Mock wallets for users
export const wallets: Wallet[] = [
  {
    id: 'w1',
    userId: 'i1',
    balance: 125000.50,
    currency: 'USD',
    paymentMethods: paymentMethods.filter(pm => pm.userId === 'i1'),
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'w2',
    userId: 'e1',
    balance: 45200.75,
    currency: 'USD',
    paymentMethods: paymentMethods.filter(pm => pm.userId === 'e1'),
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'w3',
    userId: 'i2',
    balance: 250000.00,
    currency: 'USD',
    paymentMethods: [],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'w4',
    userId: 'e2',
    balance: 12500.25,
    currency: 'USD',
    paymentMethods: [],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'w5',
    userId: 'i3',
    balance: 500000.00,
    currency: 'USD',
    paymentMethods: [],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'w6',
    userId: 'e3',
    balance: 8750.50,
    currency: 'USD',
    paymentMethods: [],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'w7',
    userId: 'i4',
    balance: 350000.00,
    currency: 'USD',
    paymentMethods: [],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'w8',
    userId: 'e4',
    balance: 22500.75,
    currency: 'USD',
    paymentMethods: [],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
];

// Helper functions
export const findWalletByUserId = (userId: string): Wallet | undefined => {
  return wallets.find(w => w.userId === userId);
};

export const getPaymentMethodsForUser = (userId: string): PaymentMethod[] => {
  const wallet = findWalletByUserId(userId);
  return wallet?.paymentMethods || [];
};

export const addPaymentMethod = (userId: string, method: PaymentMethod): void => {
  const wallet = findWalletByUserId(userId);
  if (wallet) {
    wallet.paymentMethods.push(method);
  }
};

export const updateWalletBalance = (userId: string, amount: number): void => {
  const wallet = findWalletByUserId(userId);
  if (wallet) {
    wallet.balance = amount;
    wallet.updatedAt = new Date().toISOString();
  }
};
