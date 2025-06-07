
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Command+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = [
    { title: "The Future of Large Language Models", type: "Article" },
    { title: "Quantum Computing Meets AI", type: "Research" },
    { title: "Building Ethical AI Systems", type: "Guide" },
    { title: "Neural Networks", type: "Topic" },
    { title: "Machine Learning Fundamentals", type: "Series" }
  ].filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="glass hover:glow-hover transition-all duration-300 px-4 py-2 rounded-lg flex items-center space-x-2">
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline text-muted-foreground">Search...</span>
          <kbd className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
      </DialogTrigger>
      
      <DialogContent className="glass border-border/50 max-w-2xl">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, research, topics..."
              className="pl-10 glass border-border/50 text-lg"
              autoFocus
            />
          </div>
          
          {query && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg glass hover:glow-hover cursor-pointer transition-all duration-300 flex items-center justify-between"
                  >
                    <span className="font-medium">{result.title}</span>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {result.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
          
          {!query && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Popular Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {['AI Ethics', 'Quantum Computing', 'Neural Networks', 'Future Tech'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
