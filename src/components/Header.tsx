
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, BookOpen, User, LogOut, Settings, FileText, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userRole, signOut, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:text-sm font-medium"
      >
        Skip to main content
      </a>
      
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass backdrop-blur-xl border-b border-border' : ''
      }`} role="banner">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3" aria-label="Neural homepage">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center glow">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="text-lg sm:text-xl font-semibold text-glow">Neural</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            {hasRole('author') && (
              <Link to="/create-post" className="text-muted-foreground hover:text-foreground transition-colors">
                Create Post
              </Link>
            )}
            {hasRole('admin') && (
              <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </Button>
          </div>

          {/* Search & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="sm"
              className="glass hover:glow-hover transition-all duration-300"
              aria-label="Search articles"
            >
              <Search className="w-4 h-4 mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded" aria-label="Keyboard shortcut Command K">⌘K</kbd>
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2"
                    aria-label="Account menu"
                  >
                    <User className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Account</span>
                    {userRole && (
                      <Badge variant="outline" className="text-xs">
                        {userRole}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {hasRole('author') && (
                    <DropdownMenuItem onClick={() => navigate('/create-post')}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Create Post</span>
                    </DropdownMenuItem>
                  )}
                  {hasRole('admin') && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-primary hover:bg-primary/90 glow-hover">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="container mx-auto px-6 py-4" id="mobile-navigation">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center space-x-3" onClick={handleMobileMenuClick}>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center glow">
                  <BookOpen className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                </div>
                <span className="text-xl font-semibold text-glow">Neural</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-6" role="navigation" aria-label="Main navigation">
              <h2 id="mobile-menu-title" className="sr-only">Navigation Menu</h2>
              <Link 
                to="/" 
                className="block text-lg font-medium hover:text-primary transition-colors"
                onClick={handleMobileMenuClick}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="block text-lg font-medium hover:text-primary transition-colors"
                onClick={handleMobileMenuClick}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block text-lg font-medium hover:text-primary transition-colors"
                onClick={handleMobileMenuClick}
              >
                Contact
              </Link>
              <Link 
                to="/blog" 
                className="block text-lg font-medium hover:text-primary transition-colors"
                onClick={handleMobileMenuClick}
              >
                Blog
              </Link>
              
              {hasRole('author') && (
                <Link 
                  to="/create-post" 
                  className="block text-lg font-medium hover:text-primary transition-colors"
                  onClick={handleMobileMenuClick}
                >
                  Create Post
                </Link>
              )}
              
              {hasRole('admin') && (
                <Link 
                  to="/admin" 
                  className="block text-lg font-medium hover:text-primary transition-colors"
                  onClick={handleMobileMenuClick}
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Mobile Auth Section */}
            <div className="mt-8 pt-8 border-t border-border">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium">Signed in</span>
                    {userRole && (
                      <Badge variant="outline" className="text-xs">
                        {userRole}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={handleMobileMenuClick}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Search */}
            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Articles
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Header;
