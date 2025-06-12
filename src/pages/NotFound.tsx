import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, FileText, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            {/* 404 Number */}
            <div className="text-6xl sm:text-8xl md:text-9xl font-bold text-primary/20 mb-4">
              404
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              The page you're looking for doesn't exist or has been moved. Don't worry, let's get
              you back on track.
            </p>
          </div>

          <Card className="glass mb-8">
            <CardHeader>
              <CardTitle>What you can do:</CardTitle>
              <CardDescription>
                Here are some helpful suggestions to find what you're looking for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Home className="w-6 h-6" />
                    <span>Go Home</span>
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Search className="w-6 h-6" />
                  <span>Search Articles</span>
                </Button>

                <Link to="/about">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <FileText className="w-6 h-6" />
                    <span>About Us</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>

            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>

          {/* Debug info for development */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="glass mt-8">
              <CardHeader>
                <CardTitle className="text-sm">Debug Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-mono">
                  Attempted path: {location.pathname}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
