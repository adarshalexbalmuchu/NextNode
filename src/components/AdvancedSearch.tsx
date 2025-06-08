import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Calendar, User, Tag } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchFilters {
  query: string;
  author: string;
  tags: string[];
  dateFrom?: Date;
  dateTo?: Date;
  sortBy: 'date' | 'title' | 'author' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  availableAuthors?: string[];
  availableTags?: string[];
  loading?: boolean;
  className?: string;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  availableAuthors = [],
  availableTags = [],
  loading = false,
  className = '',
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    author: '',
    tags: [],
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  const debouncedQuery = useDebounce(filters.query, 300);

  // Trigger search when debounced query or other filters change
  useEffect(() => {
    onSearch({ ...filters, query: debouncedQuery });
  }, [debouncedQuery, filters.author, filters.tags, filters.dateFrom, filters.dateTo, filters.sortBy, filters.sortOrder, onSearch]);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const addTag = (tag: string) => {
    if (tag && !filters.tags.includes(tag)) {
      updateFilter('tags', [...filters.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    updateFilter('tags', filters.tags.filter(t => t !== tag));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      author: '',
      tags: [],
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = useMemo(() => {
    return filters.author || 
           filters.tags.length > 0 || 
           filters.dateFrom || 
           filters.dateTo || 
           filters.sortBy !== 'date' || 
           filters.sortOrder !== 'desc';
  }, [filters]);

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                {[filters.author, ...filters.tags, filters.dateFrom, filters.dateTo].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search posts..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="space-y-4 pt-2">
            <Separator />
            
            {/* Author Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Author
              </label>
              <Select value={filters.author} onValueChange={(value) => updateFilter('author', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All authors</SelectItem>
                  {availableAuthors.map(author => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </label>
              <Select onValueChange={addTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Add tag" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags
                    .filter(tag => !filters.tags.includes(tag))
                    .map(tag => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  From Date
                </label>
                <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.dateFrom && 'text-muted-foreground'
                      )}
                    >
                      {filters.dateFrom ? format(filters.dateFrom, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => {
                        updateFilter('dateFrom', date);
                        setDateFromOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">To Date</label>
                <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.dateTo && 'text-muted-foreground'
                      )}
                    >
                      {filters.dateTo ? format(filters.dateTo, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => {
                        updateFilter('dateTo', date);
                        setDateToOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value: any) => updateFilter('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="relevance">Relevance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Select value={filters.sortOrder} onValueChange={(value: any) => updateFilter('sortOrder', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
