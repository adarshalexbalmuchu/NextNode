import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, User, LogOut, Settings, FileText, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, userRole, signOut, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced escape key and focus management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
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

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:text-sm font-medium"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-panel backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group" aria-label="NextNode - Home">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform will-change-transform">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:block text-lg font-bold text-glow">NextNode</span>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center space-x-8"
              role="navigation"
              aria-label="Main navigation"
            >
              <Link
                to="/blog"
                className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                Guides
              </Link>
              <Link
                to="/resources"
                className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                Resources
              </Link>
              <Link
                to="/career-tools"
                className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                Career Tools
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                About
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSearch}
                className="h-9 w-9 p-0 touch-friendly focus-visible-enhanced"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-9 w-9 p-0 touch-friendly focus-visible-enhanced"
                      aria-label="User menu"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-panel w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.email}</p>
                        {userRole && (
                          <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {hasRole(['admin', 'super_admin']) && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="w-full cursor-pointer">
                            <Settings className="w-4 h-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild size="sm" className="btn-primary">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSearch}
                className="h-9 w-9 p-0 touch-friendly focus-visible-enhanced"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="h-9 w-9 p-0 touch-friendly focus-visible-enhanced"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Menu */}
            <div
              id="mobile-menu"
              className="fixed top-16 sm:top-20 left-0 right-0 bottom-0 lg:hidden glass-panel border-t border-white/10 z-50 animate-fade-in"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
            >
              <div className="flex flex-col h-full p-4 overflow-y-auto">
                <h2 id="mobile-menu-title" className="sr-only">
                  Navigation Menu
                </h2>

                {/* Navigation Links */}
                <nav className="space-y-2 mb-6" role="navigation" aria-label="Mobile navigation">
                  <Link to="/blog" className="mobile-nav-item" onClick={handleMobileMenuClick}>
                    <FileText className="w-5 h-5" />
                    <span>Guides</span>
                  </Link>
                  <Link to="/resources" className="mobile-nav-item" onClick={handleMobileMenuClick}>
                    <BookOpen className="w-5 h-5" />
                    <span>Resources</span>
                  </Link>
                  <Link
                    to="/career-tools"
                    className="mobile-nav-item"
                    onClick={handleMobileMenuClick}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Career Tools</span>
                  </Link>
                  <Link to="/about" className="mobile-nav-item" onClick={handleMobileMenuClick}>
                    <User className="w-5 h-5" />
                    <span>About</span>
                  </Link>
                </nav>

                {/* User Section */}
                <div className="border-t border-white/10 pt-4 mt-auto">
                  {user ? (
                    <div className="space-y-2">
                      <div className="px-4 py-3 glass-panel rounded-lg">
                        <p className="font-medium text-sm">{user.email}</p>
                        {userRole && (
                          <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                        )}
                      </div>

                      {hasRole(['admin', 'super_admin']) && (
                        <Link
                          to="/admin"
                          className="mobile-nav-item"
                          onClick={handleMobileMenuClick}
                        >
                          <Settings className="w-5 h-5" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={handleSignOut}
                        className="mobile-nav-item text-destructive hover:bg-destructive/10 w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      className="mobile-nav-item bg-primary/20 text-primary hover:bg-primary/30"
                      onClick={handleMobileMenuClick}
                    >
                      <User className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Enhanced Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-title"
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="w-full max-w-2xl glass-panel p-6 animate-fade-in will-change-transform"
              onClick={e => e.stopPropagation()}
              style={{ animationDelay: '0.1s' }}
            >
              <h2 id="search-title" className="sr-only">
                Search Articles
              </h2>

              <div className="flex items-center space-x-4 mb-4">
                <Search className="w-6 h-6 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles, topics, or keywords..."
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-lg outline-none focus:outline-none"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Escape') {
                      setIsSearchOpen(false);
                    }
                    if (e.key === 'Enter') {
                      // TODO: Implement search functionality
                      const searchTerm = (e.target as HTMLInputElement).value;
                      if (searchTerm.trim()) {
                        navigate(`/blog?search=${encodeURIComponent(searchTerm)}`);
                        setIsSearchOpen(false);
                      }
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                  className="h-8 w-8 p-0 touch-friendly"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Search instructions */}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> to search or{' '}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to close
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
