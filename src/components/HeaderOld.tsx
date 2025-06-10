
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, BookOpen, User, LogOut, Settings, FileText, Menu, X, ShieldCheck } from "lucide-react";
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

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
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
      
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass-panel backdrop-blur-xl border-b border-white/10' 
            : 'bg-transparent'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              aria-label="NextNode - Home"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:block text-lg font-bold text-glow">
                NextNode
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              <Link 
                to="/blog" 
                className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                Blog
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                Contact
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
                          <p className="text-xs text-muted-foreground capitalize">
                            {userRole}
                          </p>
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
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
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
                <h2 id="mobile-menu-title" className="sr-only">Navigation Menu</h2>
                
                {/* Navigation Links */}
                <nav className="space-y-2 mb-6" role="navigation" aria-label="Mobile navigation">
                  <Link 
                    to="/blog" 
                    className="mobile-nav-item"
                    onClick={handleMobileMenuClick}
                  >
                    <FileText className="w-5 h-5" />
                    <span>Blog</span>
                  </Link>
                  <Link 
                    to="/about" 
                    className="mobile-nav-item"
                    onClick={handleMobileMenuClick}
                  >
                    <User className="w-5 h-5" />
                    <span>About</span>
                  </Link>
                  <Link 
                    to="/contact" 
                    className="mobile-nav-item"
                    onClick={handleMobileMenuClick}
                  >
                    <FileText className="w-5 h-5" />
                    <span>Contact</span>
                  </Link>
                </nav>

                {/* User Section */}
                <div className="border-t border-white/10 pt-4 mt-auto">
                  {user ? (
                    <div className="space-y-2">
                      <div className="px-4 py-3 glass-panel rounded-lg">
                        <p className="font-medium text-sm">{user.email}</p>
                        {userRole && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {userRole}
                          </p>
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
      
      {/* Search Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-4">
                <Search className="w-6 h-6 text-white/70" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="flex-1 bg-transparent text-white placeholder-white/50 text-lg outline-none"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="mt-4 text-sm text-white/50">
                Press <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd> to close
              </div>
            </div>
          </div>
        </div>
      )}
      
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-xl border-b border-white/20' : ''
        }`} 
        role="banner"
        style={{
          backgroundColor: isScrolled ? 'rgba(10, 10, 20, 0.2)' : 'transparent',
          boxShadow: isScrolled ? '0 4px 32px rgba(0, 0, 0, 0.1)' : 'none'
        }}
      >
        <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group" 
              aria-label="NextNode homepage"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                <BookOpen className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-light text-white tracking-wide group-hover:text-blue-200 transition-colors duration-300">
                NextNode
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              <Link 
                to="/" 
                className="text-white/70 hover:text-white font-light transition-all duration-300 hover:bg-white/10 px-3 py-2 rounded-lg"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-white/70 hover:text-white font-light transition-all duration-300 hover:bg-white/10 px-3 py-2 rounded-lg"
              >
                About
              </Link>
              <Link 
                to="/blog" 
                className="text-white/70 hover:text-white font-light transition-all duration-300 hover:bg-white/10 px-3 py-2 rounded-lg"
              >
                Blog
              </Link>
              <Link 
                to="/contact" 
                className="text-white/70 hover:text-white font-light transition-all duration-300 hover:bg-white/10 px-3 py-2 rounded-lg"
              >
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              
              {/* Search Icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSearch}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300"
                aria-label="Search articles"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </Button>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300"
                      aria-label="Account menu"
                    >
                      <User className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-white/10 backdrop-blur-xl border border-white/20 text-white"
                  >
                    <DropdownMenuLabel className="text-white/90">
                      My Account
                      {userRole && (
                        <div className="text-xs text-white/60 font-normal mt-1 flex items-center gap-1">
                          {userRole === 'admin' && <ShieldCheck className="w-3 h-3" />}
                          {userRole}
                        </div>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/10">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/10">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    {hasRole('author') && (
                      <DropdownMenuItem 
                        onClick={() => navigate('/create-post')}
                        className="text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Create Post</span>
                      </DropdownMenuItem>
                    )}
                    {hasRole('admin') && (
                      <DropdownMenuItem 
                        onClick={() => navigate('/admin')}
                        className="text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-light px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300"
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
            </div>
          </div>
        </div>

        {/* Mobile Menu Slide Panel */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b border-white/20"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            style={{
              backgroundColor: 'rgba(10, 10, 20, 0.95)',
              boxShadow: '0 4px 32px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="container mx-auto px-6 py-8" id="mobile-navigation">
              
              {/* Mobile Navigation */}
              <nav className="space-y-4" role="navigation" aria-label="Main navigation">
                <h2 id="mobile-menu-title" className="sr-only">Navigation Menu</h2>
                <Link 
                  to="/" 
                  className="block text-white/70 hover:text-white font-light py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={handleMobileMenuClick}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="block text-white/70 hover:text-white font-light py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={handleMobileMenuClick}
                >
                  About
                </Link>
                <Link 
                  to="/blog" 
                  className="block text-white/70 hover:text-white font-light py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={handleMobileMenuClick}
                >
                  Blog
                </Link>
                <Link 
                  to="/contact" 
                  className="block text-white/70 hover:text-white font-light py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={handleMobileMenuClick}
                >
                  Contact
                </Link>
              </nav>

              {/* Mobile User Section */}
              {user && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="text-white/90 font-medium mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Account
                    {userRole && (
                      <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                        {userRole}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {hasRole('author') && (
                      <button
                        onClick={() => {
                          navigate('/create-post');
                          handleMobileMenuClick();
                        }}
                        className="block w-full text-left text-white/70 hover:text-white font-light py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                      >
                        <FileText className="w-4 h-4 inline mr-2" />
                        Create Post
                      </button>
                    )}
                    {hasRole('admin') && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          handleMobileMenuClick();
                        }}
                        className="block w-full text-left text-white/70 hover:text-white font-light py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                      >
                        <ShieldCheck className="w-4 h-4 inline mr-2" />
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left text-white/70 hover:text-white font-light py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile Auth Section */}
              {!user && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <Link to="/auth" onClick={handleMobileMenuClick}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-light py-3 rounded-lg transition-all duration-300">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
