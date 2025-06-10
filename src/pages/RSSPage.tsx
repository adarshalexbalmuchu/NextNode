import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rss, ExternalLink } from 'lucide-react';

const RSSPage = () => {
  const handleCopyRSSLink = () => {
    const rssUrl = `${window.location.origin}/rss.xml`;
    navigator.clipboard.writeText(rssUrl);
  };

  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              RSS <span className="text-primary">Feed</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Stay updated with our latest articles and research through RSS feeds. 
              Perfect for your favorite RSS reader.
            </p>
          </div>

          {/* RSS Information */}
          <Card className="glass max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3">
                <Rss className="w-6 h-6 text-primary" />
                NextNode RSS Feed
              </CardTitle>
              <CardDescription>
                Subscribe to get automatic updates of new content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-mono text-center break-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/rss.xml` : 'https://neural.ai/rss.xml'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleCopyRSSLink} className="flex-1">
                  Copy RSS URL
                </Button>
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Browser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* RSS Readers */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-center mb-8">Popular RSS Readers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="glass">
                <CardContent className="pt-6 text-center">
                  <h3 className="font-semibold mb-2">Feedly</h3>
                  <p className="text-sm text-muted-foreground">
                    Web-based RSS reader with great organization features.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardContent className="pt-6 text-center">
                  <h3 className="font-semibold mb-2">Inoreader</h3>
                  <p className="text-sm text-muted-foreground">
                    Powerful RSS reader with advanced filtering options.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardContent className="pt-6 text-center">
                  <h3 className="font-semibold mb-2">NewsBlur</h3>
                  <p className="text-sm text-muted-foreground">
                    Social RSS reader with story intelligence features.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardContent className="pt-6 text-center">
                  <h3 className="font-semibold mb-2">The Old Reader</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple, clean interface reminiscent of Google Reader.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What's in the Feed */}
          <Card className="glass mt-12">
            <CardHeader>
              <CardTitle>What's in Our RSS Feed?</CardTitle>
              <CardDescription>
                Here's what you'll get when you subscribe to our RSS feed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Latest Articles</h3>
                  <p className="text-sm text-muted-foreground">
                    All new blog posts and articles as soon as they're published.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Research Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    New research findings and breakthrough discoveries in AI.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Full Content</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete article content, not just excerpts or summaries.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Structured Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Rich metadata including categories, tags, and publication dates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RSSPage;
