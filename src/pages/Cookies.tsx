import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie } from 'lucide-react';

const Cookies = () => {
  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Cookie <span className="text-primary">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Learn about how we use cookies to improve your browsing experience.
            </p>
          </div>

          {/* Content */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Cookie className="w-6 h-6 text-primary" />
                Cookie Policy
              </CardTitle>
              <CardDescription>
                Last updated: June 2024
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
                  <p className="text-muted-foreground">
                    Cookies are small text files that are stored on your computer or mobile device 
                    when you visit our website. They help us provide you with a better experience.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
                  <p className="text-muted-foreground">
                    We use cookies to understand how you use our site, remember your preferences, 
                    and improve our services. This includes both first-party and third-party cookies.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                    <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
                  <p className="text-muted-foreground">
                    You can control and manage cookies in various ways. Most browsers allow you to 
                    refuse cookies or delete existing ones through their settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have questions about our use of cookies, please contact us at{' '}
                    <a href="mailto:privacy@neural.ai" className="text-primary hover:underline">
                      privacy@neural.ai
                    </a>
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cookies;
