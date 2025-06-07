
import { useState, useEffect } from "react";
import { Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass backdrop-blur-xl border-b border-border' : ''
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center glow">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-glow">Neural</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Articles</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Research</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
          </nav>

          {/* Search & CTA */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="glass hover:glow-hover transition-all duration-300"
            >
              <Search className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
            </Button>
            
            <Button className="bg-primary hover:bg-primary/90 glow-hover">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
