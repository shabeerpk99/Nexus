# Payment Section Implementation Guide

## Overview

This document provides a comprehensive guide to the Payment Section implementation for the Nexus Platform. The payment system is a mock/simulation-based implementation designed to demonstrate payment flows inspired by Stripe and PayPal.

## Features Implemented

### 1. Wallet Management
- **Display Wallet Balance**: Shows current balance on dashboard and payment page
- **Balance Persistence**: Uses mock data that persists during the session
- **Multi-Currency Support**: Currently supports USD (easily extensible)
- **Real-time Updates**: Balance updates immediately after transactions

### 2. Deposit Funds
**Path**: `/payments?action=deposit`

- Multiple payment methods:
  - Credit Card
  - Debit Card
  - Bank Transfer
- Optional description field
- Form validation
- Simulated processing with 1.5s delay
- Transaction record creation

**Usage Example**:
```typescript
// In your component
import { DepositForm } from '@components/payment/DepositForm';

<DepositForm
  userId={user.id}
  walletId={wallet.id}
  onDepositSuccess={(transaction) => {
    // Handle success
    console.log('Deposited:', transaction.amount);
  }}
/>
```

### 3. Withdraw Funds
**Path**: `/payments?action=withdraw`

- Bank transfer details required
- Current balance display
- Quick amount buttons ($100, $500, $1000, $5000)
- Max withdrawal validation
- Simulated 1.5s processing

**Usage Example**:
```typescript
import { WithdrawForm } from '@components/payment/WithdrawForm';

<WithdrawForm
  userId={user.id}
  walletId={wallet.id}
  currentBalance={5000}
  onWithdrawSuccess={(transaction) => {
    // Handle success
  }}
/>
```

### 4. Transfer Funds
**Path**: `/payments?action=transfer`

- Recipient selection from all users
- Recipient preview with avatar and details
- Optional transfer message
- Balance validation
- Immediate transfer (in mock mode)

**Usage Example**:
```typescript
import { TransferForm } from '@components/payment/TransferForm';

<TransferForm
  userId={user.id}
  walletId={wallet.id}
  currentBalance={5000}
  allUsers={users}
  onTransferSuccess={(transaction) => {
    // Handle success
  }}
/>
```

### 5. Fund Deals
**Path**: `/payments?action=deals`

- Browse open deals
- View funding progress with visual bars
- Investment modal with equity calculations
- Deal summary with equity offering
- Quick amount buttons
- Transaction tracking

**Usage Example**:
```typescript
import { DealFundingCard } from '@components/payment/DealFundingCard';

<DealFundingCard
  deal={deal}
  onFundClick={(dealId) => {
    // Open funding modal
  }}
/>
```

### 6. Transaction History
**Path**: `/payments?action=history`

- Complete transaction record
- Type indicators with icons
- Status badges (Completed, Pending, Failed)
- Sortable by date
- Reference numbers
- Description and amounts

## Data Structures

### Wallet
```typescript
interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  paymentMethods: PaymentMethod[];
  createdAt: string;
  updatedAt: string;
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  walletId: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'investment' | 'payout';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  description: string;
  relatedUserId?: string;
  paymentMethodId?: string;
  dealId?: string;
  reference?: string;
  createdAt: string;
  completedAt?: string;
}
```

### Deal
```typescript
interface Deal {
  id: string;
  entrepreneurId: string;
  investorId?: string;
  title: string;
  description: string;
  fundingAmount: number;
  fundingTarget: number;
  equity: number;
  status: 'open' | 'funded' | 'rejected' | 'completed';
  currency: string;
  createdAt: string;
  fundedAt?: string;
}
```

## Helper Functions

### Wallet Functions (src/data/wallets.ts)
```typescript
// Find wallet by user ID
findWalletByUserId(userId: string): Wallet | undefined

// Get payment methods for user
getPaymentMethodsForUser(userId: string): PaymentMethod[]

// Add new payment method
addPaymentMethod(userId: string, method: PaymentMethod): void

// Update wallet balance
updateWalletBalance(userId: string, amount: number): void
```

### Transaction Functions (src/data/transactions.ts)
```typescript
// Get transactions for user
getTransactionsByUserId(userId: string): Transaction[]

// Get recent transactions with limit
getRecentTransactions(userId: string, limit?: number): Transaction[]

// Filter transactions by type
getTransactionsByType(userId: string, type: string): Transaction[]

// Calculate totals
calculateTotalDeposits(userId: string): number
calculateTotalWithdrawals(userId: string): number
calculateTotalInvested(userId: string): number

// Add new transaction
addTransaction(transaction: Transaction): void
```

### Deal Functions (src/data/deals.ts)
```typescript
// Find deal by ID
findDealById(dealId: string): Deal | undefined

// Get deals for entrepreneur
getDealsByEntrepreneur(entrepreneurId: string): Deal[]

// Get deals for investor
getDealsByInvestor(investorId: string): Deal[]

// Get open deals
getOpenDeals(): Deal[]

// Calculate funding progress percentage
calculateDealProgress(dealId: string): number

// Update deal funding
updateDealFunding(dealId: string, amount: number): Deal | undefined
```

## Navigation Integration

### Sidebar Navigation
Payment link is automatically added to both Entrepreneur and Investor sidebars:
```tsx
{ to: '/payments', icon: <Wallet size={20} />, text: 'Payments' }
```

### Dashboard Widgets
Both dashboards display the `WalletOverviewCard` showing:
- Current balance
- Quick action buttons (Deposit, Withdraw, Transfer)
- Link to payment center

## Usage in Components

### Dashboard Integration
```typescript
import { WalletOverviewCard } from '@components/payment/WalletOverviewCard';
import { findWalletByUserId } from '@data/wallets';

// In your component
const wallet = findWalletByUserId(user.id);

<WalletOverviewCard
  balance={wallet.balance}
  currency="USD"
  userName={user.name}
  userRole={user.role}
/>
```

### Transaction Display
```typescript
import { TransactionHistoryTable } from '@components/payment/TransactionHistoryTable';
import { getRecentTransactions } from '@data/transactions';

const recentTxns = getRecentTransactions(user.id, 10);

<TransactionHistoryTable 
  transactions={recentTxns}
  limit={10}
/>
```

### Balance Display
```typescript
import { WalletBalanceCard } from '@components/payment/WalletBalanceCard';

<WalletBalanceCard
  balance={5000.50}
  currency="USD"
  userName={user.name}
/>
```

## Responsive Design

All components are fully responsive:
- **Mobile**: Single column layouts, stacked forms
- **Tablet**: 2-3 column grids
- **Desktop**: Full multi-column layouts with optimal use of space

## Styling

All components use Tailwind CSS with the project's design system:
- Colors: Primary, Secondary, Accent, Success, Warning, Error
- Typography: Consistent font sizing and weights
- Spacing: Consistent padding and margins
- Transitions: Smooth hover effects

## Mock Mode Notes

All payment features operate in mock/simulation mode:

1. **No Real Processing**: Transactions are simulated, not processed
2. **Instant Completion**: 1.5 second simulated delay
3. **Balance Updates**: Local state only (persists during session)
4. **Test Data**: Pre-populated wallets and transactions
5. **Safe Testing**: Can test all flows without concerns

## Testing Checklist

- [ ] Deposit form submission
- [ ] Withdraw with insufficient balance error
- [ ] Transfer to different user
- [ ] Fund a deal and check progress
- [ ] View transaction history
- [ ] Check wallet balance updates
- [ ] Navigate via sidebar
- [ ] Dashboard widget quick actions
- [ ] Modal close/cancel operations
- [ ] Form validation messages
- [ ] Toast notifications

## Future Enhancements

To convert to production:
1. Replace mock data with API calls
2. Add real payment processor integration (Stripe/PayPal)
3. Implement server-side validation
4. Add user authentication for sensitive operations
5. Add transaction receipts/PDF export
6. Implement email notifications
7. Add transaction disputes/refunds
8. Implement fraud detection

## File Structure

```
src/
├── components/payment/
│   ├── WalletBalanceCard.tsx
│   ├── TransactionHistoryTable.tsx
│   ├── DepositForm.tsx
│   ├── WithdrawForm.tsx
│   ├── TransferForm.tsx
│   ├── DealFundingCard.tsx
│   ├── DealFundingModal.tsx
│   └── WalletOverviewCard.tsx
├── data/
│   ├── wallets.ts
│   ├── transactions.ts
│   └── deals.ts
├── pages/payments/
│   └── PaymentPage.tsx
└── types/
    └── index.ts (updated with payment types)
```

## Support & Debugging

### Common Issues

1. **Wallet balance not updating**
   - Check wallet ID format
   - Verify findWalletByUserId returns valid wallet
   - Check browser console for errors

2. **Transactions not appearing**
   - Verify addTransaction was called
   - Check transaction user ID matches current user
   - Verify timestamp format is correct

3. **Deal funding not working**
   - Ensure user has sufficient balance
   - Check deal status is 'open'
   - Verify dealId is correctly passed

### Debug Helpers

```typescript
// In browser console
import { wallets } from '@data/wallets';
import { transactions } from '@data/transactions';
import { deals } from '@data/deals';

console.log('All wallets:', wallets);
console.log('All transactions:', transactions);
console.log('All deals:', deals);
```

## Version History

- **v1.0.0** - Initial implementation with all core features
  - Deposit/Withdraw/Transfer forms
  - Deal funding flow
  - Transaction history
  - Dashboard integration

---

**Last Updated**: 2024
**Maintenance**: Check mock data persistence and UI responsiveness
