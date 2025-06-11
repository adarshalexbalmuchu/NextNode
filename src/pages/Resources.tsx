import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, BookOpen, Video, FileText, Zap, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resources = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Resources', href: '/resources' }
  ];

  const aiTools = [
    {
      name: "ChatGPT",
      category: "AI Writing",
      description: "Advanced AI assistant for writing, research, and problem-solving",
      tier: "Free + Premium",
      link: "https://chat.openai.com",
      tags: ["Writing", "Research", "Coding"]
    },
    {
      name: "Claude",
      category: "AI Assistant",
      description: "Anthropic's AI assistant for analysis, writing, and coding",
      tier: "Free + Premium",
      link: "https://claude.ai",
      tags: ["Analysis", "Writing", "Research"]
    },
    {
      name: "Grammarly",
      category: "Writing Assistant",
      description: "AI-powered writing enhancement and grammar checking",
      tier: "Free + Premium",
      link: "https://grammarly.com",
      tags: ["Writing", "Grammar", "Professional"]
    },
    {
      name: "Notion AI",
      category: "Productivity",
      description: "AI-powered workspace for notes, tasks, and collaboration",
      tier: "Premium",
      link: "https://notion.so",
      tags: ["Productivity", "Organization", "Collaboration"]
    },
    {
      name: "Canva AI",
      category: "Design",
      description: "AI-powered design tool for creating professional visuals",
      tier: "Free + Premium",
      link: "https://canva.com",
      tags: ["Design", "Visuals", "Presentations"]
    },
    {
      name: "GitHub Copilot",
      category: "Development",
      description: "AI pair programmer for coding assistance",
      tier: "Premium",
      link: "https://github.com/features/copilot",
      tags: ["Coding", "Development", "Programming"]
    }
  ];

  const templates = [
    {
      title: "AI-Optimized Resume Templates",
      description: "ATS-friendly resume templates designed for modern job markets",
      type: "Download",
      category: "Career",
      format: "DOCX + PDF"
    },
    {
      title: "ChatGPT Prompt Library",
      description: "200+ proven prompts for students and professionals",
      type: "Download",
      category: "AI Tools",
      format: "PDF + Notion"
    },
    {
      title: "Interview Preparation Checklist",
      description: "Complete checklist with AI-generated practice questions",
      type: "Download",
      category: "Career",
      format: "PDF"
    },
    {
      title: "Productivity Automation Workflows",
      description: "Step-by-step guides for automating daily tasks",
      type: "Guide",
      category: "Productivity",
      format: "Web + PDF"
    }
  ];

  const learningPaths = [
    {
      title: "AI Tools Mastery for Students",
      description: "Complete roadmap to master AI tools for academic success",
      duration: "4 weeks",
      level: "Beginner",
      modules: ["ChatGPT Basics", "Research with AI", "Study Optimization", "Academic Writing"]
    },
    {
      title: "Professional AI Integration",
      description: "Learn to integrate AI into your professional workflow",
      duration: "6 weeks",
      level: "Intermediate",
      modules: ["Workflow Automation", "AI-Powered Analytics", "Team Collaboration", "Advanced Prompting"]
    },
    {
      title: "Career Acceleration with AI",
      description: "Leverage AI to fast-track your career advancement",
      duration: "8 weeks",
      level: "Advanced",
      modules: ["Personal Branding", "Skill Development", "Network Building", "Leadership"]
    }
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
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              AI Tools & <span className="text-primary text-glow">Resources</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Curated collection of AI tools, templates, and learning resources to accelerate your personal and professional growth.
            </p>
          </div>

          {/* AI Tools Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Essential AI Tools</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiTools.map((tool, index) => (
                <Card key={index} className="glass-panel hover:scale-105 transition-transform">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <CardDescription>{tool.category}</CardDescription>
                      </div>
                      <Badge variant={tool.tier.includes('Free') ? 'default' : 'secondary'}>
                        {tool.tier}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild className="w-full" variant="outline">
                      <a href={tool.link} target="_blank" rel="noopener noreferrer">
                        Try Now <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Templates & Downloads Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Download className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Templates & Downloads</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template, index) => (
                <Card key={index} className="glass-panel">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <CardDescription>{template.category}</CardDescription>
                      </div>
                      <Badge variant="outline">{template.format}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      {template.type}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Learning Paths Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Learning Paths</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {learningPaths.map((path, index) => (
                <Card key={index} className="glass-panel">
                  <CardHeader>
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{path.duration}</Badge>
                      <Badge variant="outline">{path.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium text-sm">Modules:</h4>
                      {path.modules.map((module, moduleIndex) => (
                        <div key={moduleIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm text-muted-foreground">{module}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" variant="outline">
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Community Section */}
          <section className="mb-16">
            <Card className="glass-panel text-center p-8">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with fellow students and professionals who are leveraging AI to accelerate their careers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link to="/newsletter">
                      Get Weekly AI Tips
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Join Discord Community <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
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

export default Resources;
