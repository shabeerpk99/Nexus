export type UserRole = 'entrepreneur' | 'investor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  isOnline?: boolean;
  createdAt: string;
}

export interface Entrepreneur extends User {
  role: 'entrepreneur';
  startupName: string;
  pitchSummary: string;
  fundingNeeded: string;
  industry: string;
  location: string;
  foundedYear: number;
  teamSize: number;
}

export interface Investor extends User {
  role: 'investor';
  investmentInterests: string[];
  investmentStage: string[];
  portfolioCompanies: string[];
  totalInvestments: number;
  minimumInvestment: string;
  maximumInvestment: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface CollaborationRequest {
  id: string;
  investorId: string;
  entrepreneurId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  url: string;
  ownerId: string;
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isActive: boolean;
  createdAt: string;
}

export interface MeetingRequest {
  id: string;
  requesterId: string; // User initiating the meeting request
  recipientId: string; // User being asked for a meeting
  proposedDate: string; // ISO date string
  proposedStartTime: string; // HH:MM format
  proposedEndTime: string; // HH:MM format
  title: string;
  description: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
  respondedAt?: string;
  meetingId?: string; // Reference to confirmed meeting if accepted
}

export interface ConfirmedMeeting {
  id: string;
  participantIds: string[]; // Both users involved
  title: string;
  description: string;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  meetingType: 'video' | 'call' | 'in-person' | 'other';
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'wallet';
  provider: string;
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  paymentMethods: PaymentMethod[];
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'investment' | 'payout';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  walletId: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description: string;
  relatedUserId?: string; // For transfers
  paymentMethodId?: string;
  dealId?: string; // For investments
  reference?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Deal {
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
  completedAt?: string;
}

// Security & Access Control Types
export type PasswordStrength = 'weak' | 'medium' | 'strong';

export interface PasswordValidation {
  isValid: boolean;
  strength: PasswordStrength;
  checks: {
    minLength: boolean; // At least 8 characters
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export interface TwoFactorSession {
  userId: string;
  sessionToken: string;
  expiresAt: number;
  otpSent: boolean;
  attempts: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  twoFactorSession: TwoFactorSession | null;
  initiateTwoFactor: (userId: string) => Promise<void>;
  verifyTwoFactor: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
}