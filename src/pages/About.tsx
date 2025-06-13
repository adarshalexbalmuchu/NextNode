import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, Users, Target, Rocket, Shield } from 'lucide-react';

const About = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ];

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
              About <span className="text-primary text-glow">NextNode</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto px-2 sm:px-0">
              We're empowering students and professionals to thrive in the AI era through practical
              tools,
              <br className="hidden sm:block" />
              career insights, and actionable guides that deliver real results.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="glass-panel mb-8 sm:mb-12 border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <Target
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                  aria-hidden="true"
                />
                <span className="group-hover:text-green-400 transition-colors duration-300">
                  Our Mission
                </span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Empowering careers through AI mastery and practical skills
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-base sm:text-lg leading-relaxed">
                At NextNode, we believe that the future belongs to those who can effectively
                leverage AI tools and adapt to the rapidly evolving professional landscape. Our
                mission is to bridge the gap between cutting-edge AI technology and practical career
                advancement for students and working professionals.
              </p>
              <p className="text-base sm:text-lg leading-relaxed mt-4">
                We provide comprehensive guides, tool reviews, and career strategies that help you
                master AI tools, enhance your productivity, and accelerate your professional growth
                in any field.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="glass-panel glass-panel-hover">
              <CardHeader>
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" aria-hidden="true" />
                <CardTitle className="text-base sm:text-lg">Practical First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">
                  We focus on actionable insights and tools that deliver real-world results for your
                  career.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel glass-panel-hover">
              <CardHeader>
                <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" aria-hidden="true" />
                <CardTitle className="text-base sm:text-lg">Career Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Every guide is designed to accelerate your professional growth and enhance your
                  skill set.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel glass-panel-hover sm:col-span-2 lg:col-span-1">
              <CardHeader>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" aria-hidden="true" />
                <CardTitle className="text-base sm:text-lg">Student & Pro Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Tailored content for both students starting their journey and professionals
                  advancing their careers.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What We Cover */}
          <Card className="glass-panel mb-8 sm:mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                What We Cover
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                AI tools, career insights, and practical guides for professional growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                  AI Tools
                </Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                  Career Guides
                </Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                  Resume Building
                </Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                  Interview Prep
                </Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                  Student Resources
                </Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                  Productivity Hacks
                </Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                  ChatGPT Tips
                </Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                  Skill Development
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quality Promise */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                Our Quality Promise
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Commitment to excellence in every article
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"
                    aria-hidden="true"
                  ></div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Expert Review</h4>
                    <p className="text-muted-foreground text-sm">
                      Every article is reviewed by domain experts to ensure accuracy and depth.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"
                    aria-hidden="true"
                  ></div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">No Noise, No Ads</h4>
                    <p className="text-muted-foreground text-sm">
                      Clean, focused content without distractions or commercial bias.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"
                    aria-hidden="true"
                  ></div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Continuous Updates</h4>
                    <p className="text-muted-foreground text-sm">
                      We keep our content current with the rapidly evolving AI landscape.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
