
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center glass px-4 py-2 rounded-full text-sm text-muted-foreground mb-8 animate-fade-in">
          <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse-glow" />
          The future of intelligent discourse
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Where{' '}
          <span className="text-primary text-glow">Intelligence</span>
          <br />
          Meets Innovation
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Discover cutting-edge insights on AI, emerging technologies, and the future that's being built today.
          <br />
          <span className="text-sm">No noise. No ads. Just pure knowledge.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button size="lg" className="bg-primary hover:bg-primary/90 glow-hover text-lg px-8 py-4">
            Start Reading
          </Button>
          <Button variant="outline" size="lg" className="glass hover:glow-hover text-lg px-8 py-4">
            Explore Research
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="animate-bounce">
            <ArrowDown className="w-6 h-6 mx-auto text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
