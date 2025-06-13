import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Bell } from 'lucide-react';
import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate subscription
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Stay <span className="text-primary text-glow">Informed</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Get the latest AI insights, research breakthroughs, and technology trends delivered
              directly to your inbox.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="px-6 py-3 bg-green-400/10 border border-green-400/20 rounded-full backdrop-blur-sm">
                <span className="text-green-400 text-sm font-medium">Join 10,000+ subscribers</span>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <Card className="glass max-w-2xl mx-auto border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/10">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3">
                <Bell className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-green-400">Neural Newsletter</span>
              </CardTitle>
              <CardDescription>
                Join thousands of readers who stay ahead of the AI curve
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Subscribe to Newsletter
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Welcome to Neural!</h3>
                  <p className="text-muted-foreground">
                    Thank you for subscribing. You'll receive our next newsletter soon.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Newsletter Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="glass">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Weekly Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Curated AI research and breakthrough discoveries delivered every week.
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Exclusive Content</h3>
                <p className="text-sm text-muted-foreground">
                  Access to premium articles and in-depth analysis not available elsewhere.
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Early Access</h3>
                <p className="text-sm text-muted-foreground">
                  Be the first to know about new features, tools, and community events.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Newsletter;
