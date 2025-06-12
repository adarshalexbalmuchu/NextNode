import { useState, useEffect, useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface SearchWithFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    category?: string;
    difficulty?: string;
    sortBy?: string;
    readTime?: string;
  };
  onFiltersChange: (filters: any) => void;
  categories?: Array<{ id: string; name: string; color: string }>;
  isLoading?: boolean;
  searchLoading?: boolean;
  resultCount?: number;
  className?: string;
}

const SearchWithFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  categories = [],
  isLoading = false,
  searchLoading = false,
  resultCount,
  className,
}: SearchWithFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearch !== searchTerm) {
        onSearchChange(debouncedSearch);
        if (debouncedSearch.trim()) {
          setHasSearched(true);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearch, searchTerm, onSearchChange]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => value && value !== 'all').length;
  }, [filters]);

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      difficulty: 'all',
      sortBy: 'newest',
      readTime: 'all',
    });
  };

  const clearSearch = () => {
    setDebouncedSearch('');
    onSearchChange('');
    setHasSearched(false);
  };

  const clearAll = () => {
    clearSearch();
    clearFilters();
    setHasSearched(false);
  };

  const hasActiveSearchOrFilters = debouncedSearch.trim() || activeFiltersCount > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Enhanced Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search articles, topics, or keywords..."
            value={debouncedSearch}
            onChange={e => {
              setDebouncedSearch(e.target.value);
              if (e.target.value.trim()) {
                setHasSearched(true);
              }
            }}
            className="pl-10 pr-24 h-12 text-base focus:ring-2 focus:ring-primary/50 touch-friendly"
            aria-label="Search articles"
          />

          {/* Action buttons */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {searchLoading && <LoadingSpinner size="sm" variant="spinner" className="mr-1" />}

            {debouncedSearch && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-8 w-8 p-0 hover:bg-destructive/20 touch-friendly"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Collapsible Filter Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={cn(
                'h-8 px-2 gap-1 touch-friendly',
                activeFiltersCount > 0 && 'bg-primary/20 text-primary',
                isFiltersOpen && 'bg-primary/10'
              )}
              aria-label={`${isFiltersOpen ? 'Hide' : 'Show'} filters`}
              aria-expanded={isFiltersOpen}
            >
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <span className="text-xs bg-primary text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Search Results Summary */}
      {(hasSearched || hasActiveSearchOrFilters) && (
        <div className="flex items-center justify-between glass-panel p-3 rounded-lg animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {searchLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" variant="spinner" />
                Searching...
              </span>
            ) : (
              <span>
                {resultCount !== undefined ? (
                  <>
                    Found <span className="font-medium text-foreground">{resultCount}</span> result
                    {resultCount !== 1 ? 's' : ''}
                  </>
                ) : (
                  'Search results'
                )}
                {debouncedSearch && (
                  <span className="text-primary ml-1">for "{debouncedSearch}"</span>
                )}
                {activeFiltersCount > 0 && (
                  <span className="text-primary ml-1">
                    with {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
                  </span>
                )}
              </span>
            )}
          </div>

          {hasActiveSearchOrFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs hover:text-destructive"
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Collapsible Filters */}
      {isFiltersOpen && (
        <Card className="glass-panel animate-fade-in">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filter Results</CardTitle>
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs">
                  Clear filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.category || 'all'}
                  onValueChange={value => onFiltersChange({ ...filters, category: value })}
                >
                  <SelectTrigger className="w-full touch-friendly">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="glass-panel">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select
                  value={filters.difficulty || 'all'}
                  onValueChange={value => onFiltersChange({ ...filters, difficulty: value })}
                >
                  <SelectTrigger className="w-full touch-friendly">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent className="glass-panel">
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={filters.sortBy || 'newest'}
                  onValueChange={value => onFiltersChange({ ...filters, sortBy: value })}
                >
                  <SelectTrigger className="w-full touch-friendly">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="glass-panel">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Read Time Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Read Time</label>
                <Select
                  value={filters.readTime || 'all'}
                  onValueChange={value => onFiltersChange({ ...filters, readTime: value })}
                >
                  <SelectTrigger className="w-full touch-friendly">
                    <SelectValue placeholder="Any Length" />
                  </SelectTrigger>
                  <SelectContent className="glass-panel">
                    <SelectItem value="all">Any Length</SelectItem>
                    <SelectItem value="short">Short (≤ 5 min)</SelectItem>
                    <SelectItem value="medium">Medium (5-15 min)</SelectItem>
                    <SelectItem value="long">Long (15+ min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || value === 'all') return null;

                    let displayValue = value;
                    if (key === 'category') {
                      const category = categories.find(c => c.id === value);
                      displayValue = category?.name || value;
                    }

                    return (
                      <Badge
                        key={key}
                        variant="secondary"
                        className="flex items-center gap-1 glass-panel"
                      >
                        {displayValue}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onFiltersChange({ ...filters, [key]: 'all' })}
                          className="h-4 w-4 p-0 hover:bg-destructive/20"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchWithFilters;
