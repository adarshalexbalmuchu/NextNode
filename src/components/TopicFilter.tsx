
import { useState } from "react";
import { useCategories } from "@/hooks/usePosts";

const TopicFilter = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: categories, isLoading } = useCategories();

  const allFilters = ["All", ...(categories?.map(cat => cat.name) || [])];

  if (isLoading) {
    return (
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-12 w-24 bg-muted rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Topic Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {allFilters.map((filter) => {
            const category = categories?.find(cat => cat.name === filter);
            const isActive = activeFilter === filter;
            
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive 
                    ? 'glass glow text-primary border border-primary/30' 
                    : 'glass-subtle hover:glow-hover text-muted-foreground hover:text-primary'
                }`}
                style={category?.color && isActive ? { 
                  borderColor: `${category.color}30`,
                  boxShadow: `0 0 20px ${category.color}20`
                } : undefined}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Active Filter Indicator */}
        {activeFilter !== "All" && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Showing posts in <span className="text-primary font-medium">{activeFilter}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopicFilter;
