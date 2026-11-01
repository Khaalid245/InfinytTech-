/**
 * Contact form data payload structure for public inquiry submissions.
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  privacy: boolean;
}

/**
 * Parameters for client-side anti-spam verification.
 */
export interface AntiSpamCheckParams {
  honeypot: string;
  lastSubmitTime: number;
  now?: number;
  cooldownMs?: number;
}

/**
 * Result of client-side anti-spam verification.
 */
export interface AntiSpamResult {
  allowed: boolean;
  isBot: boolean;
  isThrottled: boolean;
  reason?: string;
}

/**
 * Evaluates whether a contact submission is legitimate or should be blocked.
 * Enforces honeypot trapping (silent fake success) and a duplicate-submission cooldown (3 seconds).
 *
 * NOTE: This is a client-side defense layer designed to deter scrapers.
 * It is complemented by the backend IP throttle (10/hour).
 */
export function checkContactAntiSpam(params: AntiSpamCheckParams): AntiSpamResult {
  const { honeypot, lastSubmitTime, now = Date.now(), cooldownMs = 3000 } = params;

  // 1. Honeypot check: Bots filling the hidden input are trapped
  if (honeypot && honeypot.trim().length > 0) {
    return {
      allowed: false,
      isBot: true,
      isThrottled: false,
      reason: 'Honeypot field populated',
    };
  }

  // 2. Cooldown check: Duplicate rapid submissions within cooldown period (default 3s)
  if (now - lastSubmitTime < cooldownMs) {
    return {
      allowed: false,
      isBot: false,
      isThrottled: true,
      reason: 'Submission cooldown active',
    };
  }

  return {
    allowed: true,
    isBot: false,
    isThrottled: false,
  };
}

/**
 * Performs client-side validation on contact inquiry inputs.
 */
export function validateContactForm(data: ContactFormData): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.message || !data.message.trim()) {
    errors.message = 'Please describe your request';
  }

  if (!data.privacy) {
    errors.privacy = 'You must accept the privacy policy to proceed';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
