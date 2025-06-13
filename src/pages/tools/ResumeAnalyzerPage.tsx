import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import ResumeAnalyzer from '@/components/tools/ResumeAnalyzer';

const ResumeAnalyzerPage = () => {
  const breadcrumbItems = [
    { label: 'Career Tools', href: '/career-tools' },
    { label: 'Resume Analyzer', href: '/tools/resume-analyzer' },
  ];

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <BreadcrumbNav items={breadcrumbItems} />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              AI Resume <span className="text-primary text-glow">Analyzer</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Get instant, detailed feedback on your resume with our AI-powered analyzer. 
              Optimize for ATS systems, improve content quality, and increase your chances of landing interviews.
            </p>
            
            {/* Features highlight */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                'ATS Optimization',
                'Keyword Analysis', 
                'Content Scoring',
                'Format Check',
                'Instant Results'
              ].map((feature) => (
                <span 
                  key={feature}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Resume Analyzer Component */}
          <ResumeAnalyzer />

          {/* Tips Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl">📝</span>
              </div>
              <h3 className="font-semibold mb-2">Prepare Your Resume</h3>
              <p className="text-sm text-muted-foreground">
                Copy your resume text or save it as a .txt file for best results
              </p>
            </div>
            
            <div className="glass-panel p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Add Job Description</h3>
              <p className="text-sm text-muted-foreground">
                Include the target job description for personalized keyword analysis
              </p>
            </div>
            
            <div className="glass-panel p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl">📊</span>
              </div>
              <h3 className="font-semibold mb-2">Get Detailed Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Receive actionable insights and improvement suggestions
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResumeAnalyzerPage;
