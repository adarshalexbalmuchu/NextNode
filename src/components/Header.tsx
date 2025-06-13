import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Settings, X, Home } from 'lucide-react';
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

  // Enhanced escape key handling for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
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
        <div className="container mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 min-h-[56px]">
            {/* Logo - Home Link */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group flex-shrink-0 hover:opacity-80 transition-opacity" 
              aria-label="NextNode - Go to Home"
              title="Go to Home"
            >
              <img 
                src="/NextNode-Logo.svg" 
                alt="NextNode Logo" 
                className="w-32 sm:w-40 lg:w-44 h-auto group-hover:scale-105 transition-transform" 
                style={{maxHeight: '40px'}} 
              />
            </Link>

            {/* Navigation - Always Visible */}
            <nav
              className="flex items-center space-x-1 sm:space-x-3 md:space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide flex-1 mx-2 sm:mx-4"
              role="navigation"
              aria-label="Main navigation"
            >
              <Link
                to="/"
                className="text-xs sm:text-sm md:text-base font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 sm:px-3 py-2 whitespace-nowrap min-h-[44px] flex items-center"
              >
                Home
              </Link>
              <Link
                to="/blog"
                className="text-xs sm:text-sm md:text-base font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 sm:px-3 py-2 whitespace-nowrap min-h-[44px] flex items-center"
              >
                Guides
              </Link>
              <Link
                to="/resources"
                className="text-xs sm:text-sm md:text-base font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 sm:px-3 py-2 whitespace-nowrap min-h-[44px] flex items-center"
              >
                Resources
              </Link>
              <Link
                to="/career-tools"
                className="text-xs sm:text-sm md:text-base font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 sm:px-3 py-2 whitespace-nowrap min-h-[44px] flex items-center"
              >
                Career Tools
              </Link>
              <Link
                to="/about"
                className="text-xs sm:text-sm md:text-base font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 sm:px-3 py-2 whitespace-nowrap min-h-[44px] flex items-center"
              >
                About
              </Link>
            </nav>

            {/* Actions - Always Visible */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSearch}
                className="h-10 w-10 sm:h-11 sm:w-11 p-0 touch-friendly focus-visible-enhanced"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-10 w-10 sm:h-11 sm:w-11 p-0 touch-friendly focus-visible-enhanced"
                      aria-label="Account menu"
                    >
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-panel w-64">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.email}</p>
                        {userRole && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {userRole} Account
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Navigation Items for easy access */}
                    <DropdownMenuItem asChild>
                      <Link to="/" className="w-full cursor-pointer">
                        <Home className="w-4 h-4 mr-2" />
                        Home Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/blog" className="w-full cursor-pointer">
                        <Search className="w-4 h-4 mr-2" />
                        Browse Guides
                      </Link>
                    </DropdownMenuItem>

                    {hasRole('admin') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="w-full cursor-pointer">
                            <Settings className="w-4 h-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive hover:bg-destructive/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild size="sm" className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2 min-h-[44px]">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
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
