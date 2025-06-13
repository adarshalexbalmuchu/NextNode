import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ExternalLink,
  FileText,
  Users,
  Target,
  Briefcase,
  GraduationCap,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerTools = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Career Tools', href: '/career-tools' },
  ];

  const resumeTools = [
    {
      name: 'Resume Analyzer AI',
      description: 'AI-powered resume analysis with ATS optimization and detailed feedback',
      features: ['ATS compatibility check', 'Content scoring', 'Keyword analysis', 'Instant feedback'],
      tier: 'Free',
      category: 'Resume',
      link: '/tools/resume-analyzer',
    },
    {
      name: 'LinkedIn Optimizer',
      description: 'Optimize your LinkedIn profile for better visibility (Coming Soon)',
      features: ['Keyword optimization', 'Profile scoring', 'Industry insights'],
      tier: 'Premium',
      category: 'Profile',
      link: null,
    },
    {
      name: 'Cover Letter Generator',
      description: 'Generate personalized cover letters with AI (Coming Soon)',
      features: ['Company research', 'Role customization', 'Multiple formats'],
      tier: 'Free',
      category: 'Cover Letter',
      link: null,
    },
  ];

  const interviewTools = [
    {
      name: 'Mock Interview AI',
      description: 'Practice interviews with AI-powered feedback (Coming Soon)',
      features: ['Real-time feedback', 'Industry-specific questions', 'Performance analytics'],
      tier: 'Premium',
      category: 'Practice',
      link: null,
    },
    {
      name: 'STAR Method Builder',
      description: 'Structure your interview responses using the STAR method (Coming Soon)',
      features: ['Story templates', 'Impact measurement', 'Delivery tips'],
      tier: 'Free',
      category: 'Preparation',
      link: null,
    },
    {
      name: 'Salary Negotiation Guide',
      description: 'Data-driven salary negotiation strategies (Coming Soon)',
      features: ['Market research', 'Script templates', 'Timing strategies'],
      tier: 'Premium',
      category: 'Negotiation',
      link: null,
    },
  ];

  const skillDevelopment = [
    {
      name: 'AI Skills Assessment',
      description: 'Assess your AI readiness and skill gaps',
      features: ['Comprehensive evaluation', 'Personalized roadmap', 'Progress tracking'],
      tier: 'Free',
      category: 'Assessment',
    },
    {
      name: 'Learning Path Generator',
      description: 'Create personalized learning paths based on career goals',
      features: ['Goal-based planning', 'Resource curation', 'Timeline optimization'],
      tier: 'Premium',
      category: 'Learning',
    },
    {
      name: 'Certification Tracker',
      description: 'Track and plan professional certifications',
      features: ['Certification database', 'ROI calculator', 'Study planning'],
      tier: 'Free',
      category: 'Certifications',
    },
  ];

  const networkingTools = [
    {
      name: 'Cold Email Templates',
      description: 'Professional email templates for networking',
      features: ['Industry-specific templates', 'Follow-up sequences', 'Response tracking'],
      tier: 'Free',
      category: 'Email',
    },
    {
      name: 'Coffee Chat Scheduler',
      description: 'Schedule and manage informational interviews',
      features: ['Calendar integration', 'Conversation guides', 'Follow-up reminders'],
      tier: 'Premium',
      category: 'Meetings',
    },
    {
      name: 'Industry Event Finder',
      description: 'Discover relevant networking events and conferences',
      features: ['Location-based search', 'Interest matching', 'Event recommendations'],
      tier: 'Free',
      category: 'Events',
    },
  ];

  const careerPlanningResources = [
    {
      title: 'Career Transition Roadmap',
      description: 'Step-by-step guide for changing careers with AI assistance',
      type: 'Guide',
      duration: '30 days',
    },
    {
      title: 'Personal Branding Toolkit',
      description: 'Build your professional brand across all platforms',
      type: 'Toolkit',
      duration: 'Ongoing',
    },
    {
      title: 'Salary Benchmarking Tool',
      description: 'Compare your compensation with industry standards',
      type: 'Tool',
      duration: 'Instant',
    },
    {
      title: 'Career Goal Setting Framework',
      description: 'Set and track meaningful career objectives',
      type: 'Framework',
      duration: '1 week',
    },
  ];

  interface Tool {
    name: string;
    description: string;
    features: string[];
    tier: string;
    category: string;
    link?: string | null;
  }

  const ToolCard = ({ tool }: { tool: Tool }) => (
    <Card className="glass-panel hover:scale-105 transition-transform h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{tool.name}</CardTitle>
            <CardDescription>{tool.category}</CardDescription>
          </div>
          <Badge variant={tool.tier.includes('Free') ? 'default' : 'secondary'}>{tool.tier}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
        <div className="space-y-2 mb-4">
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Career <span className="text-primary text-glow">Tools</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              AI-powered tools and resources to accelerate your career growth, from resume building
              to interview preparation and beyond.
            </p>
          </div>

          {/* Tools Tabs */}
          <Tabs defaultValue="resume" className="mb-16">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="resume" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Resume</span>
              </TabsTrigger>
              <TabsTrigger value="interview" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Interview</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Skills</span>
              </TabsTrigger>
              <TabsTrigger value="networking" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Network</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resume">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Resume & Profile Tools</h3>
                <p className="text-muted-foreground">
                  Create compelling resumes and professional profiles that stand out
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumeTools.map((tool, index) => (
                  <ToolCard key={index} tool={tool} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="interview">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Interview Preparation</h3>
                <p className="text-muted-foreground">
                  Master your interview skills with AI-powered practice and feedback
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviewTools.map((tool, index) => (
                  <ToolCard key={index} tool={tool} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="skills">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Skill Development</h3>
                <p className="text-muted-foreground">
                  Assess, plan, and track your professional skill development journey
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillDevelopment.map((tool, index) => (
                  <ToolCard key={index} tool={tool} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="networking">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Networking & Outreach</h3>
                <p className="text-muted-foreground">
                  Build meaningful professional connections and expand your network
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {networkingTools.map((tool, index) => (
                  <ToolCard key={index} tool={tool} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Career Planning Resources */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Career Planning Resources</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careerPlanningResources.map((resource, index) => (
                <Card key={index} className="glass-panel">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.type}</CardDescription>
                      </div>
                      <Badge variant="outline">{resource.duration}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                    <Button className="w-full" variant="outline">
                      Access Resource
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Featured Career Guides */}
          <section className="mb-16">
            <Card className="glass-panel p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Featured Career Guides</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Comprehensive guides written by career experts and AI specialists to help you
                  navigate your professional journey.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-border rounded-lg">
                  <GraduationCap className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Student Career Prep</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    From campus to career with AI assistance
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/blog?category=students">Read Guide</Link>
                  </Button>
                </div>

                <div className="text-center p-4 border border-border rounded-lg">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Career Transition</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Switch careers with confidence using AI
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/blog?category=professionals">Read Guide</Link>
                  </Button>
                </div>

                <div className="text-center p-4 border border-border rounded-lg">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Leadership in AI Era</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Lead teams and projects with AI insights
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/blog?category=leadership">Read Guide</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </section>

          {/* CTA Section */}
          <section>
            <Card className="glass-panel text-center p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
              <h3 className="text-2xl font-bold mb-4">Ready to Accelerate Your Career?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get personalized career guidance and access to our premium tools with a free
                consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Get Free Consultation</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/blog">Browse All Guides</Link>
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
