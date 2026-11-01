import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkContactAntiSpam,
  validateContactForm,
  type ContactFormData,
} from '../utils/contactValidation';

describe('Contact Form Anti-Spam and Validation Controls (Actual Implementation)', () => {
  it('allows normal submission when honeypot is empty and cooldown has elapsed', () => {
    const result = checkContactAntiSpam({
      honeypot: '',
      now: 10000,
      lastSubmitTime: 0,
      cooldownMs: 3000,
    });
    assert.strictEqual(result.allowed, true);
    assert.strictEqual(result.isBot, false);
    assert.strictEqual(result.isThrottled, false);
  });

  it('traps bots that fill the hidden honeypot input and blocks submission', () => {
    const result = checkContactAntiSpam({
      honeypot: 'https://cheap-seo-backlinks.ru',
      now: 10000,
      lastSubmitTime: 0,
      cooldownMs: 3000,
    });
    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.isBot, true);
    assert.strictEqual(result.isThrottled, false);
    assert.strictEqual(result.reason, 'Honeypot field populated');
  });

  it('throttles rapid duplicate submissions within 3-second cooldown period', () => {
    const initialTime = 10000;
    const rapidSecondClick = 11500; // 1.5s later

    const result = checkContactAntiSpam({
      honeypot: '',
      now: rapidSecondClick,
      lastSubmitTime: initialTime,
      cooldownMs: 3000,
    });
    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.isBot, false);
    assert.strictEqual(result.isThrottled, true);
    assert.strictEqual(result.reason, 'Submission cooldown active');
  });

  it('allows new submission once 3-second cooldown period has passed', () => {
    const initialTime = 10000;
    const laterTime = 13500; // 3.5s later

    const result = checkContactAntiSpam({
      honeypot: '',
      now: laterTime,
      lastSubmitTime: initialTime,
      cooldownMs: 3000,
    });
    assert.strictEqual(result.allowed, true);
    assert.strictEqual(result.isBot, false);
    assert.strictEqual(result.isThrottled, false);
  });

  it('validates required fields for legitimate normal submissions', () => {
    const payload: ContactFormData = {
      name: 'Sarah Connor',
      email: 'sarah@skynet-defense.org',
      message: 'Need enterprise cloud security review.',
      privacy: true,
    };
    const valid = validateContactForm(payload);
    assert.strictEqual(valid.isValid, true);
    assert.strictEqual(Object.keys(valid.errors).length, 0);
  });

  it('enforces field errors on missing name, malformed email, empty message, or unaccepted privacy', () => {
    const invalidPayload: ContactFormData = {
      name: '  ',
      email: 'not-an-email',
      message: '',
      privacy: false,
    };
    const invalid = validateContactForm(invalidPayload);
    assert.strictEqual(invalid.isValid, false);
    assert.ok(invalid.errors.name, 'Missing name must produce validation error');
    assert.ok(invalid.errors.email, 'Invalid email format must produce validation error');
    assert.ok(invalid.errors.message, 'Empty message must produce validation error');
    assert.ok(invalid.errors.privacy, 'Unaccepted privacy policy must produce validation error');
  });
});
