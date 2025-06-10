// Test file for contact service functionality
import { submitContactForm, type ContactFormData } from '../services/contactService';

// Test data
const testContactData: ContactFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  subject: 'general',
  message: 'This is a test message to verify the contact form functionality works properly.'
};

// Test function
export const testContactForm = async () => {
  console.log('🧪 Testing contact form submission...');
  
  try {
    const result = await submitContactForm(testContactData);
    
    if (result.success) {
      console.log('✅ Contact form test passed!');
      console.log('📧 Response:', result.message);
      console.log('🆔 Submission ID:', result.id);
      return true;
    } else {
      console.log('❌ Contact form test failed:', result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Contact form test error:', error);
    return false;
  }
};

// Test invalid data
export const testContactFormValidation = async () => {
  console.log('🧪 Testing contact form validation...');
  
  const invalidData: ContactFormData = {
    firstName: '',
    lastName: '',
    email: 'invalid-email',
    subject: '',
    message: 'short'
  };
  
  try {
    const result = await submitContactForm(invalidData);
    
    if (!result.success) {
      console.log('✅ Validation test passed - correctly rejected invalid data');
      console.log('📧 Error message:', result.message);
      return true;
    } else {
      console.log('❌ Validation test failed - should have rejected invalid data');
      return false;
    }
  } catch (error) {
    console.log('✅ Validation test passed - correctly threw error for invalid data');
    return true;
  }
};

// Run tests in development
if (import.meta.env.DEV) {
  console.log('🚀 Running contact form tests...');
  
  testContactForm().then(() => {
    return testContactFormValidation();
  }).then(() => {
    console.log('🎉 All contact form tests completed!');
  });
}
