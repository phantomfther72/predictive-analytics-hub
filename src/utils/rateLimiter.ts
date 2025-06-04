
import { ENV } from "@/config/environment";

interface RateLimitEntry {
  attempts: number;
  resetTime: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();

  private getKey(identifier: string, action: string): string {
    return `${identifier}:${action}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetTime) {
        this.storage.delete(key);
      }
    }
  }

  public isAllowed(identifier: string, action: string, maxAttempts: number, windowMs: number): boolean {
    this.cleanup();
    
    const key = this.getKey(identifier, action);
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry || now > entry.resetTime) {
      this.storage.set(key, {
        attempts: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (entry.attempts >= maxAttempts) {
      return false;
    }

    entry.attempts++;
    return true;
  }

  public getRemainingTime(identifier: string, action: string): number {
    const key = this.getKey(identifier, action);
    const entry = this.storage.get(key);
    
    if (!entry) {
      return 0;
    }

    return Math.max(0, entry.resetTime - Date.now());
  }
}

export const rateLimiter = new RateLimiter();

export const checkAuthRateLimit = (identifier: string): boolean => {
  return rateLimiter.isAllowed(
    identifier, 
    'auth', 
    ENV.RATE_LIMIT.AUTH_ATTEMPTS, 
    ENV.RATE_LIMIT.AUTH_WINDOW
  );
};

export const checkPaymentRateLimit = (identifier: string): boolean => {
  return rateLimiter.isAllowed(
    identifier, 
    'payment', 
    ENV.RATE_LIMIT.PAYMENT_ATTEMPTS, 
    ENV.RATE_LIMIT.PAYMENT_WINDOW
  );
};
