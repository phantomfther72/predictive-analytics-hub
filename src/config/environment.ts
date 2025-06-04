
// Environment configuration with secure defaults
export const ENV = {
  SUPABASE_URL: "https://nlqnfmhekpnewbueodum.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scW5mbWhla3BuZXdidWVvZHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NzcwNDMsImV4cCI6MjA1NDM1MzA0M30.6OqipAtA8GiuVpTY-eBcF9o8M8RUi9Ul6kXJKFgKsmU",
  STRIPE_PUBLISHABLE_KEY: "pk_test_51Ou5jbF8tOH0584Sh0qnkMXPQF5YD3YGKlrUa9YdS11KBQl7S37jHYEFKqkU7lsGTxUqOPP9yE7j4N41CXJg6GXE00ILRylgIp",
  RATE_LIMIT: {
    AUTH_ATTEMPTS: 5,
    AUTH_WINDOW: 15 * 60 * 1000, // 15 minutes
    PAYMENT_ATTEMPTS: 3,
    PAYMENT_WINDOW: 60 * 60 * 1000, // 1 hour
  }
} as const;

// Password validation rules
export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,
} as const;
