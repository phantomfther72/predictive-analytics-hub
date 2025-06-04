
import { PASSWORD_RULES } from "@/config/environment";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (password.length < PASSWORD_RULES.MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters long`);
  }

  if (PASSWORD_RULES.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (PASSWORD_RULES.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (PASSWORD_RULES.REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (PASSWORD_RULES.REQUIRE_SPECIAL_CHARS && !/[^a-zA-Z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateNumericInput = (value: any, min?: number, max?: number): ValidationResult => {
  const errors: string[] = [];
  const numValue = Number(value);

  if (isNaN(numValue)) {
    errors.push("Value must be a valid number");
  } else {
    if (min !== undefined && numValue < min) {
      errors.push(`Value must be at least ${min}`);
    }
    if (max !== undefined && numValue > max) {
      errors.push(`Value must be at most ${max}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
