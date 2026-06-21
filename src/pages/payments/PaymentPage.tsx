import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Wallet, CreditCard, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { WalletBalanceCard } from '../../components/payment/WalletBalanceCard';
import { TransactionHistoryTable } from '../../components/payment/TransactionHistoryTable';
import { DepositForm } from '../../components/payment/DepositForm';
import { WithdrawForm } from '../../components/payment/WithdrawForm';
import { TransferForm } from '../../components/payment/TransferForm';
import { DealFundingCard } from '../../components/payment/DealFundingCard';
import { DealFundingModal } from '../../components/payment/DealFundingModal';
import { findWalletByUserId } from '../../data/wallets';
import { getRecentTransactions, addTransaction } from '../../data/transactions';
import { getOpenDeals, updateDealFunding } from '../../data/deals';
import { users } from '../../data/users';
import toast from 'react-hot-toast';
import { Transaction } from '../../types';

type TabType = 'deposit' | 'withdraw' | 'transfer' | 'deals' | 'history';

export const PaymentPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('deposit');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to access the payment center.</p>
      </div>
    );
  }

  // Load wallet and transactions on mount and when user changes
  useEffect(() => {
    const wallet = findWalletByUserId(user.id);
    if (wallet) {
      setWalletBalance(wallet.balance);
      const userTransactions = getRecentTransactions(user.id, 50);
      setTransactions(userTransactions);
    }
  }, [user]);

  // Handle tab from URL params
  useEffect(() => {
    const actionParam = searchParams.get('action') as TabType;
    if (actionParam && ['deposit', 'withdraw', 'transfer', 'deals', 'history'].includes(actionParam)) {
      setActiveTab(actionParam);
    }
  }, [searchParams]);

  const handleDepositSuccess = (transaction: Transaction) => {
    addTransaction(transaction);
    setWalletBalance(prev => prev + transaction.amount);
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleWithdrawSuccess = (transaction: Transaction) => {
    addTransaction(transaction);
    setWalletBalance(prev => prev - transaction.amount);
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleTransferSuccess = (transaction: Transaction) => {
    addTransaction(transaction);
    setWalletBalance(prev => prev - transaction.amount);
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleFundingSuccess = (transaction: Transaction, dealId: string) => {
    addTransaction(transaction);
    setWalletBalance(prev => prev - transaction.amount);
    setTransactions(prev => [transaction, ...prev]);
    
    // Update deal funding
    updateDealFunding(dealId, transaction.amount);
    toast.success(`Deal funding updated! Investment amount: $${transaction.amount.toFixed(2)}`);
  };

  const handleFundClick = (dealId: string) => {
    setSelectedDealId(dealId);
    setIsModalOpen(true);
  };

  const openDeals = getOpenDeals();
  const selectedDeal = selectedDealId
    ? openDeals.find(d => d.id === selectedDealId)
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Center</h1>
        <p className="text-gray-600 mt-1">Manage your wallet, funds, and investments</p>
      </div>

      {/* Wallet Balance */}
      <WalletBalanceCard
        balance={walletBalance}
        currency="USD"
        userName={user.name}
      />

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {[
          { id: 'deposit' as TabType, label: 'Deposit', icon: '📥' },
          { id: 'withdraw' as TabType, label: 'Withdraw', icon: '📤' },
          { id: 'transfer' as TabType, label: 'Transfer', icon: '🔄' },
          { id: 'deals' as TabType, label: 'Fund Deals', icon: '📈' },
          { id: 'history' as TabType, label: 'History', icon: '📋' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* Deposit Tab */}
        {activeTab === 'deposit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DepositForm
                userId={user.id}
                walletId={`w${user.id}`}
                onDepositSuccess={handleDepositSuccess}
              />
            </div>

            {/* Info Cards */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardBody className="space-y-3">
                  <h4 className="font-semibold text-gray-900">💡 How to Deposit</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary-600">1.</span>
                      <span>Select your payment method (Credit Card, Debit Card, or Bank Transfer)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary-600">2.</span>
                      <span>Enter the amount you want to deposit</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary-600">3.</span>
                      <span>Review the details and confirm</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary-600">4.</span>
                      <span>Funds will be available immediately (in mock mode)</span>
                    </li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="space-y-3">
                  <h4 className="font-semibold text-gray-900">🔒 Security</h4>
                  <p className="text-sm text-gray-600">
                    All deposits are processed securely. We use industry-standard encryption for all transactions.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="success">SSL Encrypted</Badge>
                    <Badge variant="success">PCI Compliant</Badge>
                    <Badge variant="success">Verified</Badge>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* Withdraw Tab */}
        {activeTab === 'withdraw' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <WithdrawForm
                userId={user.id}
                walletId={`w${user.id}`}
                currentBalance={walletBalance}
                onWithdrawSuccess={handleWithdrawSuccess}
              />
            </div>

            {/* Info Cards */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardBody className="space-y-3">
                  <h4 className="font-semibold text-gray-900">📤 Withdrawal Information</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Minimum withdrawal: $100</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Processing time: 1-2 business days</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Bank transfer fee: None</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Available balance: ${walletBalance.toFixed(2)}</span>
                    </li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h4 className="font-semibold text-gray-900 mb-3">Common Questions</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong className="text-gray-900">How long does withdrawal take?</strong><br />
                      Most withdrawals are processed within 1-2 business days.
                    </p>
                    <p>
                      <strong className="text-gray-900">Are there fees?</strong><br />
                      No, we don't charge any withdrawal fees.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* Transfer Tab */}
        {activeTab === 'transfer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TransferForm
                userId={user.id}
                walletId={`w${user.id}`}
                currentBalance={walletBalance}
                allUsers={users}
                onTransferSuccess={handleTransferSuccess}
              />
            </div>

            {/* Info Cards */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardBody className="space-y-3">
                  <h4 className="font-semibold text-gray-900">🔄 Transfer Features</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Send funds to any Nexus user</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Instant transfers (in mock mode)</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>No transfer fees</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Optional message with each transfer</span>
                    </li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h4 className="font-semibold text-gray-900 mb-3">Recent Recipients</h4>
                  <div className="space-y-2">
                    {transactions
                      .filter(t => t.type === 'transfer' && t.relatedUserId)
                      .map(t => {
                        const recipient = users.find(u => u.id === t.relatedUserId);
                        return recipient ? (
                          <div key={t.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <img src={recipient.avatarUrl} alt={recipient.name} className="w-8 h-8 rounded-full" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{recipient.name}</p>
                              <p className="text-xs text-gray-500">${t.amount.toFixed(2)}</p>
                            </div>
                          </div>
                        ) : null;
                      })
                      .slice(0, 3)}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* Fund Deals Tab */}
        {activeTab === 'deals' && (
          <div className="space-y-4">
            {openDeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openDeals.map((deal) => (
                  <DealFundingCard
                    key={deal.id}
                    deal={deal}
                    onFundClick={handleFundClick}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardBody>
                  <div className="text-center py-8">
                    <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">No open deals available at the moment</p>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <TransactionHistoryTable transactions={transactions} limit={20} />
        )}
      </div>

      {/* Deal Funding Modal */}
      {selectedDeal && (
        <DealFundingModal
          deal={selectedDeal}
          isOpen={isModalOpen}
          userBalance={walletBalance}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDealId(null);
          }}
          onFundingSuccess={(transaction) => {
            handleFundingSuccess(transaction, selectedDeal.id);
            setIsModalOpen(false);
            setSelectedDealId(null);
          }}
        />
      )}
    </div>
  );
};
