import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { OTPInput } from '../../components/security/OTPInput';
import toast from 'react-hot-toast';

export const TwoFactorAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { twoFactorSession, verifyTwoFactor, resendOTP, logout, user, isAuthenticated } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [attempts, setAttempts] = useState(0);
  const [showResend, setShowResend] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  // Get email from location state or fallback
  const email = (location.state as { email?: string })?.email || 'your email';

  // Countdown timer for OTP resend
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Redirect if authenticated and session is cleared
  useEffect(() => {
    if (isAuthenticated && !twoFactorSession) {
      const savedRole = sessionStorage.getItem('pending_login_role');

      if (savedRole === 'entrepreneur') {
        navigate('/dashboard/entrepreneur', { replace: true });
      } else if (savedRole === 'investor') {
        navigate('/dashboard/investor', { replace: true });
      } else if (user?.role === 'entrepreneur') {
        navigate('/dashboard/entrepreneur', { replace: true });
      } else if (user?.role === 'investor') {
        navigate('/dashboard/investor', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
      return;
    }

    if (!twoFactorSession && !isAuthenticated) {
      // Redirect to login if no 2FA session and not authenticated
      navigate('/login', { replace: true });
    }
  }, [twoFactorSession, isAuthenticated, user, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setVerificationError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setVerificationError('');

    try {
      setIsSubmitting(true);
      await verifyTwoFactor(otp);
      toast.success('Verified successfully!');

      const savedRole = sessionStorage.getItem('pending_login_role');
      sessionStorage.removeItem('pending_login_role');
      sessionStorage.removeItem('pending_login_email');

      if (savedRole === 'entrepreneur') {
        navigate('/dashboard/entrepreneur', { replace: true });
      } else if (savedRole === 'investor') {
        navigate('/dashboard/investor', { replace: true });
      } else if (user?.role === 'entrepreneur') {
        navigate('/dashboard/entrepreneur', { replace: true });
      } else if (user?.role === 'investor') {
        navigate('/dashboard/investor', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch {
      setIsSubmitting(false);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setVerificationError('Too many attempts. Please try again later.');
        setTimeout(() => {
          logout();
          navigate('/login', { replace: true });
        }, 2000);
      } else {
        setVerificationError(`Invalid code. ${3 - newAttempts} attempts remaining.`);
        setOtp('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await resendOTP();
      setTimeLeft(60);
      setShowResend(false);
      setOtp('');
      setVerificationError('');
      toast.success('Code resent to your email');
    } catch {
      toast.error('Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  if (!twoFactorSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        {/* Header */}
        <CardHeader className="border-b border-gray-200 space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mx-auto">
            <Mail size={24} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">Verify Your Identity</h1>
          <p className="text-sm text-gray-600 text-center">
            We've sent a 6-digit code to <span className="font-semibold">{email}</span>
          </p>
        </CardHeader>

        <CardBody className="space-y-6">
          {/* Success Message Area */}
          {attempts > 0 && attempts < 3 && !verificationError && (
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 flex gap-2">
              <Clock size={20} className="text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning-900">Verification in progress</p>
                <p className="text-xs text-warning-700">Enter the code to continue</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {verificationError && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-3 flex gap-2">
              <AlertCircle size={20} className="text-error-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-error-900">{verificationError}</p>
              </div>
            </div>
          )}

          {/* OTP Input Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              onComplete={(value) => {
                // Auto-submit when 6 digits are entered
                if (value.length === 6 && !isLoading) {
                  setOtp(value);
                  // Trigger form submission
                  setTimeout(() => {
                    const form = document.querySelector('form') as HTMLFormElement;
                    form?.dispatchEvent(new Event('submit', { cancelable: true }));
                  }, 100);
                }
              }}
              disabled={isLoading}
              error={verificationError ? 'Invalid code' : undefined}
            />

            {/* Submit Button */}
            <Button
              variant="primary"
              fullWidth
              type="submit"
              isLoading={isLoading || isSubmitting}
              disabled={otp.length !== 6 || isLoading || isSubmitting}
            >
              Verify Code
            </Button>
          </form>

          {/* Resend OTP Section */}
          <div className="space-y-3">
            {!showResend ? (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Resend available in <span className="font-bold text-primary-600">{timeLeft}s</span>
                </p>
              </div>
            ) : (
              <Button
                variant="outline"
                fullWidth
                onClick={handleResendOTP}
                isLoading={isLoading}
              >
                Resend Code
              </Button>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Secondary Actions */}
          <Button
            variant="ghost"
            fullWidth
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            disabled={isLoading}
          >
            Login with different account
          </Button>

          {/* Security Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">🔒 Security:</span> This code is valid for 10 minutes. Never share this code with anyone.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
