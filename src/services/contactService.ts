// Contact form service for NextNode
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  id?: string;
}

/**
 * Submit contact form data
 * Currently simulates submission - replace with actual API endpoint
 */
export const submitContactForm = async (
  data: ContactFormData
): Promise<ContactSubmissionResponse> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validate data on client side before submission
    if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
      throw new Error('All fields are required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Message length validation
    if (data.message.length < 10) {
      throw new Error('Message must be at least 10 characters long');
    }

    // Log the submission (in production, this would go to your backend)
    console.log('Contact form submission:', {
      ...data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });

    // TODO: Replace with actual API call
    // Example:
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    //
    // if (!response.ok) {
    //   throw new Error('Failed to submit form');
    // }
    //
    // return await response.json();

    // For now, return a simulated success response
    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } catch (error) {
    console.error('Contact form submission error:', error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
    };
  }
};

/**
 * Send email notification for contact form submission
 * This would typically be handled by your backend service
 */
export const sendContactNotification = async (data: ContactFormData): Promise<void> => {
  // TODO: Implement email notification service
  // This could use services like:
  // - EmailJS for client-side email sending
  // - Supabase Edge Functions
  // - Netlify Functions
  // - Vercel API Routes
  // - Traditional backend API

  console.log('Email notification would be sent for:', data.email);
};

/**
 * Get contact form submission analytics
 */
export const getContactFormAnalytics = () => {
  // TODO: Implement analytics tracking
  // Track form submissions, conversion rates, common inquiry types, etc.

  return {
    totalSubmissions: 0,
    commonSubjects: ['general', 'collaboration', 'technical'],
    averageResponseTime: '2 hours',
  };
};
