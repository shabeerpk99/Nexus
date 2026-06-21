import { PasswordValidation, PasswordStrength } from '../types';

export const validatePassword = (password: string): PasswordValidation => {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    // detect any non-alphanumeric character as a special char
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
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

export default validatePassword;
