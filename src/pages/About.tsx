import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, Users, Target, Rocket, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
              About <span className="text-primary">NextNode</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto px-2 sm:px-0">
              We're building the future of knowledge sharing through AI-powered insights, 
              <br className="hidden sm:block" />
              cutting-edge research, and community-driven innovation.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="glass mb-8 sm:mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                Our Mission
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Democratizing access to AI knowledge and innovation
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-base sm:text-lg leading-relaxed">
                NextNode exists to bridge the gap between complex AI research and practical understanding. 
                We believe that the future of technology should be accessible to everyone, not just experts. 
                <br className="hidden sm:block" />
                Through carefully crafted articles, deep-dive research papers, and community discussions, 
                we're creating a platform where curiosity meets cutting-edge innovation.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="glass">
              <CardHeader>
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" aria-hidden="true" />
                <CardTitle className="text-base sm:text-lg">Knowledge First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">
                  We prioritize accuracy, depth, and clarity in every piece of content we publish.
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" aria-hidden="true" />
                <CardTitle className="text-base sm:text-lg">Innovation Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">
                  We spotlight breakthrough technologies and emerging trends that shape tomorrow.
                </p>
              </CardContent>
            </Card>

            <Card className="glass sm:col-span-2 lg:col-span-1">
              <CardHeader>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" aria-hidden="true" />
                <CardTitle className="text-base sm:text-lg">Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Our platform thrives on diverse perspectives and collaborative learning.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What We Cover */}
          <Card className="glass mb-8 sm:mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                What We Cover
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Exploring the frontiers of artificial intelligence and technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">Machine Learning</Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">Neural Networks</Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">Quantum Computing</Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">AI Ethics</Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">Deep Learning</Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">Computer Vision</Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">NLP</Badge>
                <Badge variant="outline" className="p-2 sm:p-3 text-center text-xs sm:text-sm">Robotics</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quality Promise */}
          <Card className="glass">
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
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" aria-hidden="true"></div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Expert Review</h4>
                    <p className="text-muted-foreground text-sm">
                      Every article is reviewed by domain experts to ensure accuracy and depth.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" aria-hidden="true"></div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">No Noise, No Ads</h4>
                    <p className="text-muted-foreground text-sm">
                      Clean, focused content without distractions or commercial bias.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" aria-hidden="true"></div>
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
