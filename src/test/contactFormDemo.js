// Contact Form Demo Script
// Run this in the browser console on the contact page to test functionality

console.log('🎯 NextNode Contact Form Demo');
console.log('============================');

// Test form validation
const testFormValidation = () => {
  console.log('\n📝 Testing Form Validation...');
  
  // Get form elements
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitButton = document.querySelector('button[type="submit"]');
  
  if (!firstNameInput || !lastNameInput || !emailInput || !messageInput) {
    console.log('❌ Form elements not found');
    return;
  }
  
  console.log('✅ All form elements found');
  
  // Test empty form submission
  console.log('\n🧪 Testing empty form submission...');
  const form = document.querySelector('form');
  if (form) {
    // This will trigger validation
    form.requestSubmit();
    console.log('📋 Empty form submission triggered - check for validation errors');
  }
};

// Test valid form data
const testValidFormData = () => {
  console.log('\n✅ Testing valid form data...');
  
  // Fill form with valid data
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  
  if (firstNameInput && lastNameInput && emailInput && messageInput) {
    firstNameInput.value = 'John';
    lastNameInput.value = 'Doe';
    emailInput.value = 'john.doe@example.com';
    messageInput.value = 'This is a test message to verify the contact form works correctly.';
    
    // Dispatch input events to trigger React state updates
    [firstNameInput, lastNameInput, emailInput, messageInput].forEach(input => {
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    
    console.log('📝 Form filled with valid test data');
    console.log('💡 You can now click "Send Message" to test submission');
  }
};

// Test contact information display
const testContactInfo = () => {
  console.log('\n📧 Testing Contact Information Display...');
  
  const emailLink = document.querySelector('a[href="mailto:nextnode.ai@gmail.com"]');
  const addressText = document.querySelector('address');
  
  if (emailLink) {
    console.log('✅ Email link found:', emailLink.textContent);
  } else {
    console.log('❌ Email link not found');
  }
  
  if (addressText) {
    console.log('✅ Address found:', addressText.textContent.trim());
  } else {
    console.log('❌ Address not found');
  }
};

// Test responsive design
const testResponsiveDesign = () => {
  console.log('\n📱 Testing Responsive Design...');
  
  const form = document.querySelector('form');
  const contactInfo = document.querySelector('.lg\\:col-span-2');
  
  if (form && contactInfo) {
    console.log('✅ Form and contact info sections found');
    console.log('💡 Resize browser window to test responsive behavior');
  }
};

// Run all tests
const runAllTests = () => {
  console.log('🚀 Running NextNode Contact Form Tests...\n');
  
  testFormValidation();
  testValidFormData();
  testContactInfo();
  testResponsiveDesign();
  
  console.log('\n🎉 Contact Form Demo Complete!');
  console.log('💡 Try interacting with the form to see validation in action');
};

// Auto-run tests if this script is executed
runAllTests();

// Export functions for manual testing
window.contactFormDemo = {
  testFormValidation,
  testValidFormData,
  testContactInfo,
  testResponsiveDesign,
  runAllTests
};

console.log('\n🔧 Available demo functions:');
console.log('- contactFormDemo.testFormValidation()');
console.log('- contactFormDemo.testValidFormData()');
console.log('- contactFormDemo.testContactInfo()');
console.log('- contactFormDemo.testResponsiveDesign()');
console.log('- contactFormDemo.runAllTests()');
