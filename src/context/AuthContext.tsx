import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole, AuthContextType, TwoFactorSession } from '../types';
import { users } from '../data/users';
import toast from 'react-hot-toast';

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = 'business_nexus_user';
const RESET_TOKEN_KEY = 'business_nexus_reset_token';
const TWO_FACTOR_SESSION_KEY = 'business_nexus_2fa_session';

// Mock 2FA OTP (in real app, sent via email)
const generateMockOTP = (): string => {
  // For developer convenience in non-production builds, return a fixed OTP.
  // This makes demo logins deterministic: use '123456' in dev.
  try {
    // Vite exposes import.meta.env.DEV in development
     
    const isDev = (import.meta as any)?.env?.DEV;
    if (isDev) return '123456';
  } catch {
    // ignore and fallback to random
  }

  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [twoFactorSession, setTwoFactorSession] = useState<TwoFactorSession | null>(null);
  const [pendingOTP, setPendingOTP] = useState<string>(''); // Mock: store OTP for verification

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Check for 2FA session
    const stored2FASession = localStorage.getItem(TWO_FACTOR_SESSION_KEY);
    if (stored2FASession) {
      const session = JSON.parse(stored2FASession);
      // Check if session is still valid
      if (session.expiresAt > Date.now()) {
        setTwoFactorSession(session);
      } else {
        // Session expired
        localStorage.removeItem(TWO_FACTOR_SESSION_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  // Mock login function - initiates 2FA flow
  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email and role
      const foundUser = users.find(u => u.email === email && u.role === role);
      
      if (!foundUser) {
        throw new Error('Invalid credentials or user not found');
      }

      // Initiate 2FA instead of logging in directly
      await initiateTwoFactor(foundUser.id);
      
      // Store the email and role for the 2FA page and final redirect
      sessionStorage.setItem('pending_login_email', email);
      sessionStorage.setItem('pending_login_role', role);
      
      toast.success('Verification code sent to your email');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function - in a real app, this would make an API call
  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (users.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser: User = {
        id: `${role[0]}${users.length + 1}`,
        name,
        email,
        role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        bio: '',
        isOnline: true,
        createdAt: new Date().toISOString()
      };
      
      // Add user to mock data
      users.push(newUser);
      
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('No account found with this email');
      }
      
      // Generate reset token (in a real app, this would be a secure token)
      const resetToken = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(RESET_TOKEN_KEY, resetToken);
      
      // In a real app, this would send an email
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  // Mock reset password function
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify token
      const storedToken = localStorage.getItem(RESET_TOKEN_KEY);
      if (token !== storedToken) {
        throw new Error('Invalid or expired reset token');
      }
      
      // In a real app, this would update the user's password in the database
      localStorage.removeItem(RESET_TOKEN_KEY);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    setUser(null);
    setTwoFactorSession(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TWO_FACTOR_SESSION_KEY);
    sessionStorage.removeItem('pending_login_email');
    toast.success('Logged out successfully');
  };

  // Initiate 2FA flow
  const initiateTwoFactor = async (userId: string): Promise<void> => {
    try {
      // Simulate sending OTP via email
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate mock OTP
      let otp = generateMockOTP();

      // If this is a known demo account (or in dev), make OTP deterministic for testing
      const demoEmails = ['sarah@techwave.io', 'michael@vcinnovate.com'];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isDev = (import.meta as any)?.env?.DEV;
      const targetUser = users.find(u => u.id === userId);
      if (isDev || (targetUser && demoEmails.includes(targetUser.email))) {
        otp = '123456';
      }

      setPendingOTP(otp);

      // Create 2FA session (store otp in session for dev/demo flows)
      const sessionToken = Math.random().toString(36).substring(2, 15);
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      const session: TwoFactorSession & { otp?: string } = {
        userId,
        sessionToken,
        expiresAt,
        otpSent: true,
        attempts: 0,
        otp,
      };

      setTwoFactorSession(session);
      localStorage.setItem(TWO_FACTOR_SESSION_KEY, JSON.stringify(session));

      // Log OTP in development for easier demo testing
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isDev = (import.meta as any)?.env?.DEV;
        if (isDev) {
          // avoid leaking in production
          // eslint-disable-next-line no-console
          console.info(`Dev 2FA OTP for user ${userId}: ${otp}`);
        }
      } catch {
        // ignore
      }
    } catch (error) {
      toast.error('Failed to initiate 2FA');
      throw error;
    }
  };

  // Verify 2FA OTP
  const verifyTwoFactor = async (otp: string): Promise<void> => {
    if (!twoFactorSession) {
      throw new Error('No 2FA session active');
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify OTP (in real app, this would check against the backend)
      const sessionOtp = (twoFactorSession as any)?.otp || pendingOTP;
      if (otp !== sessionOtp) {
        throw new Error('Invalid verification code');
      }

      // Check session validity
      if (twoFactorSession.expiresAt < Date.now()) {
        throw new Error('Verification code expired');
      }

      // Find and login user
      const foundUser = users.find(u => u.id === twoFactorSession.userId);
      if (!foundUser) {
        throw new Error('User not found');
      }

      // Complete login
      setUser(foundUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser));

      // Clear 2FA session
      setTwoFactorSession(null);
      localStorage.removeItem(TWO_FACTOR_SESSION_KEY);
      sessionStorage.removeItem('pending_login_email');
      setPendingOTP('');

      toast.success('Successfully logged in!');
    } catch (error) {
      // Increment attempts
      if (twoFactorSession) {
        const updatedSession = {
          ...twoFactorSession,
          attempts: twoFactorSession.attempts + 1,
        };
        setTwoFactorSession(updatedSession);
        localStorage.setItem(TWO_FACTOR_SESSION_KEY, JSON.stringify(updatedSession));
      }

      throw error;
    }
  };

  // Resend OTP
  const resendOTP = async (): Promise<void> => {
    if (!twoFactorSession) {
      throw new Error('No 2FA session active');
    }

    try {
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate new OTP
      const newOtp = generateMockOTP();
      setPendingOTP(newOtp);

      // Update OTP for verification

      // Reset attempts
      const updatedSession = {
        ...twoFactorSession,
        attempts: 0,
        expiresAt: Date.now() + 10 * 60 * 1000, // Reset expiry
        otp: newOtp,
      };
      setTwoFactorSession(updatedSession);
      localStorage.setItem(TWO_FACTOR_SESSION_KEY, JSON.stringify(updatedSession));

      toast.success('New code sent to your email');
    } catch (error) {
      toast.error('Failed to resend code');
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in mock data
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      
      // Update current user if it's the same user
      if (user?.id === userId) {
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isLoading,
    twoFactorSession,
    initiateTwoFactor,
    verifyTwoFactor,
    resendOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};