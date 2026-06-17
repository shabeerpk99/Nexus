import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { PasswordValidation, PasswordStrength } from '../../types';

interface PasswordStrengthMeterProps {
  password: string;
  showDetails?: boolean;
  className?: string;
}

export const validatePassword = (password: string): PasswordValidation => {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  let strength: PasswordStrength = 'weak';

  if (passedChecks >= 5) {
    strength = 'strong';
  } else if (passedChecks >= 3) {
    strength = 'medium';
  }

  const isValid = checks.minLength && checks.hasUppercase && checks.hasLowercase && checks.hasNumber;

  return {
    isValid,
    strength,
    checks,
  };
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showDetails = true,
  className = '',
}) => {
  const validation = useMemo(() => validatePassword(password), [password]);
  const { strength, checks } = validation;

  const getStrengthColor = (str: PasswordStrength): string => {
    switch (str) {
      case 'strong':
        return 'bg-success-500';
      case 'medium':
        return 'bg-warning-500';
      case 'weak':
        return 'bg-error-500';
    }
  };

  const getStrengthLabel = (str: PasswordStrength): string => {
    switch (str) {
      case 'strong':
        return 'Strong';
      case 'medium':
        return 'Medium';
      case 'weak':
        return 'Weak';
    }
  };

  const getStrengthLabelColor = (str: PasswordStrength): string => {
    switch (str) {
      case 'strong':
        return 'text-success-700';
      case 'medium':
        return 'text-warning-700';
      case 'weak':
        return 'text-error-700';
    }
  };

  const CheckItem: React.FC<{ label: string; checked: boolean }> = ({ label, checked }) => (
    <div className="flex items-center gap-2">
      {checked ? (
        <Check size={16} className="text-success-600" />
      ) : (
        <X size={16} className="text-gray-300" />
      )}
      <span className={`text-sm ${checked ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className={className}>
      {/* Strength Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">Password Strength</span>
          <span className={`text-xs font-bold ${getStrengthLabelColor(strength)}`}>
            {getStrengthLabel(strength)}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
            style={{
              width:
                strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%',
            }}
          />
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="mt-3 space-y-1.5 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>

          <CheckItem label="At least 8 characters" checked={checks.minLength} />
          <CheckItem label="Uppercase letter (A-Z)" checked={checks.hasUppercase} />
          <CheckItem label="Lowercase letter (a-z)" checked={checks.hasLowercase} />
          <CheckItem label="Number (0-9)" checked={checks.hasNumber} />
          <CheckItem label="Special character (!@#$%^&*)" checked={checks.hasSpecialChar} />
        </div>
      )}

      {/* Tips */}
      {password.length > 0 && !validation.isValid && (
        <p className="text-xs text-error-600 mt-2">
          ⚠️ Your password is too weak. Please add uppercase, lowercase, and a number.
        </p>
      )}

      {password.length > 0 && validation.isValid && strength === 'weak' && (
        <p className="text-xs text-warning-600 mt-2">
          💡 Consider adding special characters for a stronger password.
        </p>
      )}

      {password.length > 0 && strength === 'strong' && (
        <p className="text-xs text-success-600 mt-2">
          ✓ Excellent password strength!
        </p>
      )}
    </div>
  );
};
