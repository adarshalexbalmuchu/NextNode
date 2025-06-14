
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
  Briefcase,
  GraduationCap,
  Zap,
  TrendingUp,
  Bot,
  BrainCircuit,
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
      description: 'AI-powered resume analysis with ATS optimization and detailed feedback',
      features: ['ATS compatibility check', 'Content scoring', 'Keyword analysis', 'Instant feedback'],
      tier: 'Free',
      category: 'Resume Optimization',
      link: '/tools/resume-analyzer',
      icon: FileText,
    },
    {
      name: 'AI Interview Coach',
      description: 'Practice interviews with AI-powered feedback and personalized coaching',
      features: ['Mock interviews', 'Real-time feedback', 'Industry-specific questions', 'Performance analytics'],
      tier: 'Coming Soon',
      category: 'Interview Prep',
      link: null,
      icon: Users,
    },
    {
      name: 'AI Career Path Advisor',
      description: 'Get personalized career recommendations based on your skills and interests',
      features: ['Skills assessment', 'Career matching', 'Learning roadmap', 'Job market insights'],
      tier: 'Coming Soon',
      category: 'Career Planning',
      link: null,
      icon: Target,
    },
    {
      name: 'AI Cover Letter Generator',
      description: 'Generate personalized cover letters tailored for specific jobs and companies',
      features: ['Company research', 'Role customization', 'Multiple formats', 'ATS optimization'],
      tier: 'Coming Soon',
      category: 'Job Applications',
      link: null,
      icon: BrainCircuit,
    },
    {
      name: 'AI Skills Gap Analyzer',
      description: 'Identify skill gaps and get AI-powered learning recommendations',
      features: ['Skills assessment', 'Gap analysis', 'Learning resources', 'Progress tracking'],
      tier: 'Coming Soon',
      category: 'Skill Development',
      link: null,
      icon: TrendingUp,
    },
    {
      name: 'AI Networking Assistant',
      description: 'AI-powered networking strategies and outreach message generation',
      features: ['LinkedIn optimization', 'Message templates', 'Networking strategies', 'Follow-up reminders'],
      tier: 'Coming Soon',
      category: 'Professional Networking',
      link: null,
      icon: Bot,
    },
  ];

  interface Tool {
    name: string;
    description: string;
    features: string[];
    tier: string;
    category: string;
    link?: string | null;
    icon: React.ComponentType<{ className?: string }>;
  }

  const ToolCard = ({ tool }: { tool: Tool }) => (
    <Card className="glass-panel hover:scale-105 transition-transform h-full">
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <tool.icon className="w-6 h-6 text-primary" />
          </div>
          <Badge variant={tool.tier === 'Free' ? 'default' : 'secondary'}>{tool.tier}</Badge>
        </div>
        <div>
          <CardTitle className="text-lg">{tool.name}</CardTitle>
          <CardDescription className="text-primary font-medium">{tool.category}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
        <div className="space-y-2 mb-6">
          {tool.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
        {tool.link ? (
          <Button asChild className="w-full" variant="outline">
            <Link to={tool.link}>
              Try Tool
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

      <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <BreadcrumbNav items={breadcrumbItems} />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <GraduationCap className="w-12 h-12 text-primary" />
              <Bot className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              AI-Powered <span className="text-primary text-glow">Career Tools</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Accelerate your career growth with AI-powered tools designed specifically for students and 
              early-career professionals. From resume optimization to interview preparation.
            </p>
            
            {/* Key Benefits */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                'AI-Powered Analysis',
                'Instant Feedback', 
                'ATS Optimization',
                'Student-Focused',
                'Career Ready'
              ].map((feature) => (
                <span 
                  key={feature}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* AI Tools Grid */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">AI Career Tools for Students</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* Student Success Section */}
          <section className="mb-16">
            <Card className="glass-panel p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Designed for Student Success</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Our AI-powered tools are specifically crafted to help students and new graduates 
                  navigate the competitive job market with confidence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-border rounded-lg bg-background/50">
                  <GraduationCap className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Student-Focused</h4>
                  <p className="text-sm text-muted-foreground">
                    Tools designed for students with limited work experience
                  </p>
                </div>

                <div className="text-center p-4 border border-border rounded-lg bg-background/50">
                  <Bot className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">AI-Powered</h4>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI algorithms provide personalized insights
                  </p>
                </div>

                <div className="text-center p-4 border border-border rounded-lg bg-background/50">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Career Ready</h4>
                  <p className="text-sm text-muted-foreground">
                    Prepare for the modern job market with confidence
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* CTA Section */}
          <section>
            <Card className="glass-panel text-center p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
              <h3 className="text-2xl font-bold mb-4">Ready to Launch Your Career?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start with our free AI Resume Analyzer and take the first step towards landing your dream job.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/tools/resume-analyzer">
                    <FileText className="w-4 h-4 mr-2" />
                    Start with Resume Analyzer
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Get Career Guidance</Link>
                </Button>
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
