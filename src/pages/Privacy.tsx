import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Privacy <span className="text-primary text-glow">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Your privacy matters to us. Here's how we protect and handle your data.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="px-6 py-3 bg-green-400/10 border border-green-400/20 rounded-full backdrop-blur-sm">
                <span className="text-green-400 text-sm font-medium">Last updated: June 2024</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <Card className="glass-panel border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-green-400">Privacy Policy</span>
              </CardTitle>
              <CardDescription>Last updated: June 2024</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="space-y-6">
                <section className="group hover:bg-green-400/5 p-4 rounded-lg transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-4 group-hover:text-green-400 transition-colors duration-300">
                    Information We Collect
                  </h2>
                  <p className="text-muted-foreground">
                    We collect information you provide directly to us, such as when you create an
                    account, subscribe to our newsletter, or contact us for support.
                  </p>
                </section>

                <section className="group hover:bg-green-400/5 p-4 rounded-lg transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-4 group-hover:text-green-400 transition-colors duration-300">
                    How We Use Your Information
                  </h2>
                  <p className="text-muted-foreground">
                    We use the information we collect to provide, maintain, and improve our
                    services, communicate with you, and comply with legal obligations.
                  </p>
                </section>

                <section className="group hover:bg-green-400/5 p-4 rounded-lg transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-4 group-hover:text-green-400 transition-colors duration-300">
                    Information Sharing
                  </h2>
                  <p className="text-muted-foreground">
                    We do not sell, trade, or otherwise transfer your personal information to third
                    parties without your consent, except as described in this policy.
                  </p>
                </section>

                <section className="group hover:bg-green-400/5 p-4 rounded-lg transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-4 group-hover:text-green-400 transition-colors duration-300">
                    Contact Us
                  </h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, please contact us at{' '}
                    <a
                      href="mailto:privacy@neural.ai"
                      className="text-green-400 hover:text-green-300 hover:underline transition-colors duration-300 drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]"
                    >
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

export default Privacy;
