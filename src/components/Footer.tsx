
import { Link } from "react-router-dom";
import { Mail, Rss, BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 md:py-16" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3" aria-label="Neural homepage">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center glow">
                <span className="text-primary-foreground font-bold text-sm sm:text-base" aria-hidden="true">N</span>
              </div>
              <span className="text-lg sm:text-xl font-semibold text-glow">Neural</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The premier destination for AI research, innovation insights, and the future of technology.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <nav className="space-y-2 text-sm" role="navigation" aria-label="Footer navigation">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors block">Home</Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors block">About Us</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors block">Contact</Link>
              <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors block">All Articles</Link>
            </nav>
          </div>

          {/* Topics */}
          <div>
            <h4 className="font-semibold mb-4">Topics</h4>
            <nav className="space-y-2 text-sm" role="navigation" aria-label="Topic navigation">
              <button className="text-muted-foreground hover:text-primary transition-colors block text-left">Machine Learning</button>
              <button className="text-muted-foreground hover:text-primary transition-colors block text-left">Quantum Computing</button>
              <button className="text-muted-foreground hover:text-primary transition-colors block text-left">Neural Networks</button>
              <button className="text-muted-foreground hover:text-primary transition-colors block text-left">AI Ethics</button>
            </nav>
          </div>

          {/* Legal & Community */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <nav className="space-y-2 text-sm" role="navigation" aria-label="Community links">
              <Link 
                to="/newsletter" 
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                aria-label="Subscribe to our newsletter"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                Newsletter
              </Link>
              <Link 
                to="/rss" 
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                aria-label="RSS feed for articles"
              >
                <Rss className="w-4 h-4" aria-hidden="true" />
                RSS Feed
              </Link>
              <a 
                href="mailto:hello@neural.ai" 
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                aria-label="Contact support via email"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                Support
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div>© 2024 Neural. Crafted for the future of knowledge.</div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
