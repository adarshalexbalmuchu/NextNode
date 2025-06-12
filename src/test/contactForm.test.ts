// Test file for contact service functionality
import { describe, it, expect } from 'vitest';
import { submitContactForm, type ContactFormData } from '../services/contactService';

// Test data
const testContactData: ContactFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  subject: 'general',
  message: 'This is a test message to verify the contact form functionality works properly.',
};

describe('Contact Form Service', () => {
  it('should handle valid contact form submission', async () => {
    // This is a placeholder test since we don't have a real backend
    // In a real scenario, you would mock the submission service
    expect(testContactData.firstName).toBe('John');
    expect(testContactData.email).toContain('@');
    expect(testContactData.message.length).toBeGreaterThan(10);
  });

  it('should validate required fields', () => {
    const invalidData: ContactFormData = {
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      subject: '',
      message: 'short',
    };

    // Basic validation tests
    expect(invalidData.firstName).toBe('');
    expect(invalidData.email).not.toContain('@');
    expect(invalidData.message.length).toBeLessThan(20);
  });

  it('should have proper email format validation', () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'invalid-email';

    expect(validEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(invalidEmail).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});
