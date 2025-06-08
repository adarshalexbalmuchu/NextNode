
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, BookOpen, User, LogOut, Settings, FileText } from "lucide-react";
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

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userRole, signOut, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass backdrop-blur-xl border-b border-border' : ''
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center glow">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-glow">Neural</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Articles</Link>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Research</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
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

          {/* Search & Auth */}
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
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
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
    </header>
  );
};

export default Header;
