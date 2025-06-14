
import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Users,
  Target,
  BrainCircuit,
  TrendingUp,
  Bot,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerTools = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'AI Career Tools', href: '/career-tools' },
  ];

  const aiCareerTools = [
    {
      name: 'AI Resume Analyzer',
      description: 'Get instant feedback on your resume with AI-powered analysis and ATS optimization',
      features: ['ATS Compatibility Check', 'Content Scoring', 'Keyword Analysis', 'Improvement Suggestions'],
      tier: 'Free',
      category: 'Resume Optimization',
      link: '/tools/resume-analyzer',
      icon: FileText,
      isAvailable: true,
    },
    {
      name: 'AI Interview Coach',
      description: 'Practice interviews with personalized AI coaching and real-time feedback',
      features: ['Mock Interviews', 'Real-time Feedback', 'Industry Questions', 'Performance Analytics'],
      tier: 'Coming Soon',
      category: 'Interview Prep',
      icon: Users,
      isAvailable: false,
    },
    {
      name: 'AI Career Path Advisor',
      description: 'Discover your ideal career path with AI-powered recommendations',
      features: ['Skills Assessment', 'Career Matching', 'Learning Roadmap', 'Market Insights'],
      tier: 'Coming Soon',
      category: 'Career Planning',
      icon: Target,
      isAvailable: false,
    },
    {
      name: 'AI Cover Letter Generator',
      description: 'Create compelling cover letters tailored for specific roles and companies',
      features: ['Company Research', 'Role Customization', 'Multiple Formats', 'ATS Optimization'],
      tier: 'Coming Soon',
      category: 'Job Applications',
      icon: BrainCircuit,
      isAvailable: false,
    },
    {
      name: 'AI Skills Gap Analyzer',
      description: 'Identify skill gaps and get personalized learning recommendations',
      features: ['Skills Assessment', 'Gap Analysis', 'Learning Resources', 'Progress Tracking'],
      tier: 'Coming Soon',
      category: 'Skill Development',
      icon: TrendingUp,
      isAvailable: false,
    },
    {
      name: 'AI Networking Assistant',
      description: 'Master professional networking with AI-powered strategies and templates',
      features: ['LinkedIn Optimization', 'Message Templates', 'Networking Strategies', 'Follow-up Reminders'],
      tier: 'Coming Soon',
      category: 'Professional Networking',
      icon: Bot,
      isAvailable: false,
    },
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      description: 'Advanced algorithms analyze your career materials and provide personalized recommendations',
    },
    {
      icon: CheckCircle,
      title: 'ATS Optimized',
      description: 'Ensure your applications pass through Applicant Tracking Systems successfully',
    },
    {
      icon: GraduationCap,
      title: 'Student-Focused',
      description: 'Tools designed specifically for students and early-career professionals',
    },
  ];

  const ToolCard = ({ tool }: { tool: typeof aiCareerTools[0] }) => (
    <Card className="glass-panel hover:scale-[1.02] transition-all duration-300 h-full group border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <tool.icon className="w-7 h-7 text-primary" />
          </div>
          <Badge 
            variant={tool.tier === 'Free' ? 'default' : 'secondary'}
            className={tool.tier === 'Free' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            {tool.tier}
          </Badge>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl font-bold">{tool.name}</CardTitle>
          <CardDescription className="text-primary/80 font-medium text-sm">
            {tool.category}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-6 leading-relaxed">{tool.description}</p>
        
        <div className="space-y-3 mb-8">
          {tool.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-1"></div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {tool.isAvailable ? (
          <Button asChild className="w-full group/btn">
            <Link to={tool.link!}>
              Try Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            Coming Soon
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <BreadcrumbNav items={breadcrumbItems} />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight">
              AI Career Tools for 
              <span className="text-primary block mt-2">Students</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Launch your career with confidence using our AI-powered tools designed specifically 
              for students and early-career professionals.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="glass-panel p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/tools/resume-analyzer">
                <FileText className="w-5 h-5 mr-2" />
                Start with Resume Analyzer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* AI Tools Grid */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your AI Career Tool</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Each tool is powered by advanced AI to give you personalized insights and recommendations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiCareerTools.map((tool, index) => (
                <div
                  key={index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section>
            <Card className="glass-panel text-center p-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
              <div className="max-w-3xl mx-auto">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Ready to Accelerate Your Career?</h3>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Join thousands of students who have already improved their job prospects with our AI tools. 
                  Start with our free Resume Analyzer and take the first step towards your dream career.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="text-lg px-8">
                    <Link to="/tools/resume-analyzer">
                      <FileText className="w-5 h-5 mr-2" />
                      Analyze My Resume
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                    <Link to="/contact">Get Career Support</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CareerTools;
