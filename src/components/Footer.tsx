
const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center glow">
                <span className="text-primary-foreground font-bold">N</span>
              </div>
              <span className="text-xl font-semibold text-glow">Neural</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The premier destination for AI research, innovation insights, and the future of technology.
            </p>
          </div>

          {/* Content */}
          <div>
            <h4 className="font-semibold mb-4">Content</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors block">Latest Articles</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors block">Research Papers</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors block">AI Insights</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors block">Future Tech</a>
            </div>
          </div>

          {/* Topics */}
          <div>
            <h4 className="font-semibold mb-4">Topics</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors block">Machine Learning</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors block">Quantum Computing</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors block">Neural Networks</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors block">AI Ethics</a>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors block">About</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors block">Newsletter</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors block">RSS Feed</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors block">Contact</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div>© 2024 Neural. Crafted for the future of knowledge.</div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
