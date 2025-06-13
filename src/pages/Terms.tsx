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
              Terms of <span className="text-primary text-glow">Service</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              The terms and conditions that govern your use of our platform.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="px-6 py-3 bg-green-400/10 border border-green-400/20 rounded-full backdrop-blur-sm">
                <span className="text-green-400 text-sm font-medium">Last updated: June 2024</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <Card className="glass border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-green-400">Terms of Service</span>
              </CardTitle>
              <CardDescription>Last updated: June 2024</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="space-y-6">
                <section className="group hover:bg-green-400/5 p-4 rounded-lg transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-4 group-hover:text-green-400 transition-colors duration-300">
                    Acceptance of Terms
                  </h2>
                  <p className="text-muted-foreground">
                    By accessing and using NextNode, you accept and agree to be bound by the terms
                    and provision of this agreement.
                  </p>
                </section>

                <section className="group hover:bg-green-400/5 p-4 rounded-lg transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-4 group-hover:text-green-400 transition-colors duration-300">
                    Use License
                  </h2>
                  <p className="text-muted-foreground">
                    Permission is granted to temporarily access the materials on NextNode for
                    personal, non-commercial transitory viewing only.
                  </p>
                </section>

                <section className="group hover:bg-green-400/5 p-4 rounded-lg transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-4 group-hover:text-green-400 transition-colors duration-300">
                    User Accounts
                  </h2>
                  <p className="text-muted-foreground">
                    When you create an account, you are responsible for maintaining the security of
                    your account and are fully responsible for all activities that occur under the
                    account.
                  </p>
                </section>

                <section className="group hover:bg-green-400/5 p-4 rounded-lg transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-4 group-hover:text-green-400 transition-colors duration-300">
                    Prohibited Uses
                  </h2>
                  <p className="text-muted-foreground">
                    You may not use our service for any illegal or unauthorized purpose or to
                    violate any international, federal, provincial, or state laws or regulations.
                  </p>
                </section>

                <section className="group hover:bg-green-400/5 p-4 rounded-lg transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-4 group-hover:text-green-400 transition-colors duration-300">
                    Contact Information
                  </h2>
                  <p className="text-muted-foreground">
                    Questions about the Terms of Service should be sent to us at{' '}
                    <a
                      href="mailto:nextnode.ai@gmail.com"
                      className="text-green-400 hover:text-green-300 hover:underline transition-colors duration-300 drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]"
                    >
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
