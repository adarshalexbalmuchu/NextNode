
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo } from "react";

const Hero = memo(() => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20"
      aria-labelledby="hero-heading"
    >
      <div className="text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div 
          className="inline-flex items-center glass px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 animate-fade-in"
          role="banner"
          aria-label="Platform tagline"
        >
          <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse-glow" aria-hidden="true" />
          AI Tools, Careers & Practical Guides
        </div>

        {/* Main Heading - Critical content, no animation delay for LCP */}
        <h1 
          id="hero-heading"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight"
        >
          Your{' '}
          <span className="text-primary text-glow">AI-Powered</span>
          <br />
          Career Hub
        </h1>

        {/* Subtitle */}
        <p 
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed animate-fade-in px-2 sm:px-4 lg:px-0 max-w-3xl mx-auto" 
          style={{ animationDelay: '0.1s' }}
        >
          Master AI tools, accelerate your career, and gain practical skills for students and working professionals.
          <br className="hidden sm:block" />
          <span className="text-sm sm:text-base block sm:inline mt-2 sm:mt-0">Real tools. Real results. Real growth.</span>
        </p>

        {/* CTA Buttons - Responsive and accessible */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mb-12 sm:mb-16 animate-fade-in px-4 sm:px-0" style={{ 
          animationDelay: '0.2s',
          willChange: 'transform, opacity'
        }}>
          <Button 
            size="lg" 
            className="btn-primary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[48px]"
            aria-label="Explore AI tools and guides"
          >
            Explore AI Tools
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="btn-glass w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[48px]"
            aria-label="Browse career resources"
          >
            Career Resources
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="animate-bounce">
            <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Scroll down to see more content</span>
          </div>
        </div>
      </div>
    </section>
  );
});

// Set display name for debugging
Hero.displayName = 'Hero';

export default Hero;
