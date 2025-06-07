
import { useState } from "react";

const TopicFilter = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const topics = [
    { name: 'All', count: 156 },
    { name: 'AI Research', count: 48 },
    { name: 'Machine Learning', count: 32 },
    { name: 'Quantum Computing', count: 18 },
    { name: 'Robotics', count: 24 },
    { name: 'Neural Networks', count: 34 },
    { name: 'Ethics', count: 16 },
    { name: 'Future Tech', count: 28 }
  ];

  return (
    <section className="py-12 px-6 border-b border-border/50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-wrap gap-3 justify-center">
          {topics.map((topic, index) => (
            <button
              key={topic.name}
              onClick={() => setActiveFilter(topic.name)}
              className={`
                px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2
                ${activeFilter === topic.name 
                  ? 'bg-primary text-primary-foreground glow' 
                  : 'glass hover:glow-hover text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <span className="font-medium">{topic.name}</span>
              <span className={`
                text-xs px-2 py-1 rounded-full 
                ${activeFilter === topic.name 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : 'bg-primary/10 text-primary'
                }
              `}>
                {topic.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopicFilter;
