
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
  BookOpen,
  Newspaper,
  ArrowRight,
  Zap,
  Play,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerTools = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'AI Career Hub', href: '/career-tools' },
  ];

  const aiCareerTools = [
    {
      name: 'AI Resume Builder',
      description: 'Create ATS-optimized resumes with AI-powered content suggestions and formatting',
      category: 'Resume Building',
      link: '/tools/resume-analyzer',
      icon: FileText,
      isAvailable: true,
      tier: 'Free',
    },
    {
      name: 'Interview AI Coach',
      description: 'Practice interviews with AI feedback, common questions, and performance analytics',
      category: 'Interview Prep',
      icon: Users,
      isAvailable: false,
      tier: 'Coming Soon',
    },
    {
      name: 'Skills Gap Analyzer',
      description: 'Identify missing skills and get personalized learning recommendations',
      category: 'Skills Learning',
      icon: Target,
      isAvailable: false,
      tier: 'Coming Soon',
    },
    {
      name: 'Cover Letter AI',
      description: 'Generate compelling cover letters tailored to specific job descriptions',
      category: 'Resume Building',
      icon: BrainCircuit,
      isAvailable: false,
      tier: 'Coming Soon',
    },
    {
      name: 'Career Path AI',
      description: 'Get AI-powered career recommendations based on your skills and interests',
      category: 'Skills Learning',
      icon: TrendingUp,
      isAvailable: false,
      tier: 'Coming Soon',
    },
    {
      name: 'LinkedIn Optimizer',
      description: 'Optimize your LinkedIn profile with AI suggestions for better visibility',
      category: 'Interview Prep',
      icon: Bot,
      isAvailable: false,
      tier: 'Coming Soon',
    },
  ];

  const aiBlogPosts = [
    {
      title: 'How AI is Transforming Job Applications in 2024',
      excerpt: 'Discover the latest AI tools that are changing how students approach job hunting and resume building.',
      readTime: '5 min read',
      category: 'Career Tips',
      featured: true,
    },
    {
      title: 'Building the Perfect AI-Enhanced Resume',
      excerpt: 'Step-by-step guide to creating resumes that pass ATS systems and impress recruiters.',
      readTime: '8 min read',
      category: 'Resume Building',
      featured: true,
    },
    {
      title: 'AI Interview Preparation: Your Complete Guide',
      excerpt: 'Master technical and behavioral interviews with AI-powered practice tools and feedback.',
      readTime: '12 min read',
      category: 'Interview Prep',
      featured: false,
    },
  ];

  const aiCourses = [
    {
      name: 'AI Resume Mastery',
      description: 'Complete course on creating professional resumes using AI tools and best practices',
      duration: '4 hours',
      level: 'Beginner',
      price: 'Free',
      rating: 4.8,
      students: '2.5k',
      icon: FileText,
    },
    {
      name: 'Interview Success with AI',
      description: 'Advanced interview preparation using AI coaching and real-world scenarios',
      duration: '6 hours',
      level: 'Intermediate',
      price: '$49',
      rating: 4.9,
      students: '1.8k',
      icon: Users,
    },
    {
      name: 'AI-Powered Career Planning',
      description: 'Strategic career development using AI insights and market analysis',
      duration: '8 hours',
      level: 'Advanced',
      price: '$79',
      rating: 4.7,
      students: '950',
      icon: TrendingUp,
    },
  ];

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
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <Bot className="w-7 h-7 text-primary" />
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              AI Career Hub for 
              <span className="text-primary block mt-2">Students</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Everything you need to launch your career with AI: tools, insights, and courses 
              designed specifically for students.
            </p>

            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/tools/resume-analyzer">
                <Zap className="w-5 h-5 mr-2" />
                Start Building Your Career
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* AI Blog Posts Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Newspaper className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">AI Career Insights</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Stay updated with the latest AI trends in career development and job searching
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {aiBlogPosts.map((post, index) => (
                <Card key={index} className="glass-panel hover:scale-[1.02] transition-all duration-300 h-full group border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      {post.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{post.readTime}</span>
                      <Button variant="ghost" size="sm" className="group/btn">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/blog">
                  View All Articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </section>

          {/* AI Career Tools Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">AI Career Tools</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Powerful AI-driven tools to enhance your resume, interview skills, and career planning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiCareerTools.map((tool, index) => (
                <Card key={index} className="glass-panel hover:scale-[1.02] transition-all duration-300 h-full group border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <tool.icon className="w-6 h-6 text-primary" />
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
              ))}
            </div>
          </section>

          {/* AI Courses Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">AI Career Courses</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Comprehensive courses to master AI tools and accelerate your career growth
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiCourses.map((course, index) => (
                <Card key={index} className="glass-panel hover:scale-[1.02] transition-all duration-300 h-full group border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <course.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{course.price}</div>
                        <Badge variant="outline" className="text-xs">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold mb-2">{course.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-4 leading-relaxed">{course.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium">{course.students}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{course.rating}</span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full group/btn" variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      {course.price === 'Free' ? 'Start Learning' : 'Enroll Now'}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section>
            <Card className="glass-panel text-center p-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
              <div className="max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Ready to Launch Your AI-Powered Career?</h3>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Join thousands of students using AI to land their dream jobs. Start with our free tools 
                  and advance with expert courses.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="text-lg px-8">
                    <Link to="/tools/resume-analyzer">
                      <FileText className="w-5 h-5 mr-2" />
                      Start Free Tools
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Browse Courses
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
