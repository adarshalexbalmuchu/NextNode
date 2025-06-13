import { useState } from 'react';
import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, MessageSquare, Send, MapPin, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { submitContactForm } from '@/services/contactService';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/contact' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitStatus('success');

        // Reset form after success
        setTimeout(() => {
          setSubmitStatus('idle');
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            subject: '',
            message: '',
          });
        }, 4000);
      } else {
        setSubmitStatus('error');
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrors({
        submit:
          'An unexpected error occurred. Please try again or contact us directly at nextnode.ai@gmail.com',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <BreadcrumbNav items={breadcrumbItems} />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
              Get in <span className="text-primary text-glow">Touch</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto px-2 sm:px-0">
              Have a question, suggestion, or want to collaborate? We'd love to hear from you.
              <br className="hidden sm:block" />
              Reach out and let's explore the future of AI together.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="px-6 py-3 bg-green-400/10 border border-green-400/20 rounded-full backdrop-blur-sm">
                <span className="text-green-400 text-sm font-medium">
                  We respond within 24 hours
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="glass-panel border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-green-400">Send us a Message</span>
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Fill out the form below and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitStatus === 'success' && (
                    <Alert className="mb-6 border-green-500 text-green-700 dark:border-green-400 dark:text-green-300">
                      <Send className="h-4 w-4" />
                      <AlertDescription>
                        Thank you for your message! We'll get back to you within 24 hours.
                      </AlertDescription>
                    </Alert>
                  )}

                  {submitStatus === 'error' &&
                    (errors.submit || Object.keys(errors).length > 0) && (
                      <Alert className="mb-6 border-red-500 text-red-700 dark:border-red-400 dark:text-red-300">
                        <AlertDescription>
                          {errors.submit || 'Please fix the following errors and try again.'}
                        </AlertDescription>
                      </Alert>
                    )}

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={e => handleInputChange('firstName', e.target.value)}
                          placeholder="John"
                          required
                          className={`min-h-[44px] ${errors.firstName ? 'border-red-500 focus:border-red-500' : ''}`}
                          aria-describedby={errors.firstName ? 'firstName-error' : 'firstName-help'}
                          aria-invalid={!!errors.firstName}
                        />
                        {errors.firstName && (
                          <p id="firstName-error" className="text-red-500 text-sm" role="alert">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={e => handleInputChange('lastName', e.target.value)}
                          placeholder="Doe"
                          required
                          className={`min-h-[44px] ${errors.lastName ? 'border-red-500 focus:border-red-500' : ''}`}
                          aria-describedby={errors.lastName ? 'lastName-error' : 'lastName-help'}
                          aria-invalid={!!errors.lastName}
                        />
                        {errors.lastName && (
                          <p id="lastName-error" className="text-red-500 text-sm" role="alert">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                        required
                        className={`min-h-[44px] ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                        aria-describedby={errors.email ? 'email-error' : 'email-help'}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-red-500 text-sm" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">
                        Subject <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.subject}
                        onValueChange={value => handleInputChange('subject', value)}
                        required
                      >
                        <SelectTrigger
                          className={`min-h-[44px] ${errors.subject ? 'border-red-500 focus:border-red-500' : ''}`}
                          aria-describedby={errors.subject ? 'subject-error' : 'subject-help'}
                          aria-invalid={!!errors.subject}
                        >
                          <SelectValue placeholder="What's this about?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="collaboration">Collaboration</SelectItem>
                          <SelectItem value="research">Research Partnership</SelectItem>
                          <SelectItem value="content">Content Suggestion</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="media">Media Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.subject && (
                        <p id="subject-error" className="text-red-500 text-sm" role="alert">
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={e => handleInputChange('message', e.target.value)}
                        placeholder="Tell us more about your inquiry... (minimum 10 characters)"
                        rows={6}
                        required
                        className={`min-h-[120px] resize-y ${errors.message ? 'border-red-500 focus:border-red-500' : ''}`}
                        aria-describedby={errors.message ? 'message-error' : 'message-help'}
                        aria-invalid={!!errors.message}
                      />
                      {errors.message && (
                        <p id="message-error" className="text-red-500 text-sm" role="alert">
                          {errors.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formData.message.length}/10 characters minimum
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="btn-primary w-full min-h-[48px] text-base sm:text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                      aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
                    >
                      {isSubmitting ? (
                        <>
                          <div
                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"
                            aria-hidden="true"
                          ></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 sm:space-y-6">
              {/* Contact Details */}
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail
                      className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium text-sm sm:text-base">Email</p>
                      <a
                        href="mailto:nextnode.ai@gmail.com"
                        className="text-muted-foreground text-sm hover:text-primary transition-colors"
                        aria-label="Send email to nextnode.ai@gmail.com"
                      >
                        nextnode.ai@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin
                      className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium text-sm sm:text-base">Address</p>
                      <address className="text-muted-foreground text-sm not-italic">
                        Ranchi, Jharkhand
                        <br />
                        India
                      </address>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock
                      className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium text-sm sm:text-base">Response Time</p>
                      <p className="text-muted-foreground text-sm">Within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time Badge */}
              <Card className="glass-panel">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Badge className="mb-3">Fast Response</Badge>
                    <p className="text-sm text-muted-foreground">
                      We typically respond to all inquiries within 24 hours during business days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
