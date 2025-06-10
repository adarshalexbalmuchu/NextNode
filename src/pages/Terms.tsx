import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Terms of <span className="text-primary">Service</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              The terms and conditions that govern your use of our platform.
            </p>
          </div>

          {/* Content */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                Terms of Service
              </CardTitle>
              <CardDescription>
                Last updated: June 2024
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing and using NextNode, you accept and agree to be bound by the terms 
                    and provision of this agreement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Use License</h2>
                  <p className="text-muted-foreground">
                    Permission is granted to temporarily access the materials on NextNode for personal, 
                    non-commercial transitory viewing only.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
                  <p className="text-muted-foreground">
                    When you create an account, you are responsible for maintaining the security of your 
                    account and are fully responsible for all activities that occur under the account.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
                  <p className="text-muted-foreground">
                    You may not use our service for any illegal or unauthorized purpose or to violate 
                    any international, federal, provincial, or state laws or regulations.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                  <p className="text-muted-foreground">
                    Questions about the Terms of Service should be sent to us at{' '}
                    <a href="mailto:nextnode.ai@gmail.com" className="text-primary hover:underline">
                      nextnode.ai@gmail.com
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

export default Terms;
