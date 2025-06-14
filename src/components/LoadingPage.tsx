
import React, { useEffect, useState } from 'react';

interface SparkProps {
  delay: number;
  duration: number;
  x: string;
  y: string;
}

const ElectricSpark: React.FC<SparkProps> = ({ delay, duration, x, y }) => (
  <div
    className="absolute w-1 h-1 bg-primary rounded-full animate-electric-pulse"
    style={{
      left: x,
      top: y,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  >
    {/* Lightning bolt path */}
    <div
      className="absolute w-0.5 bg-gradient-to-b from-primary to-transparent opacity-80 animate-lightning"
      style={{
        height: '60px',
        left: '-1px',
        top: '-30px',
        transform: 'rotate(15deg)',
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    />
  </div>
);

const LoadingPage: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Generate random sparks
  const sparks = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 1 + Math.random() * 2,
    x: `${10 + Math.random() * 80}%`,
    y: `${10 + Math.random() * 80}%`,
  }));

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 animate-grid-flow"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Electric sparks */}
      {sparks.map(spark => (
        <ElectricSpark
          key={spark.id}
          delay={spark.delay}
          duration={spark.duration}
          x={spark.x}
          y={spark.y}
        />
      ))}

      {/* Central loading content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo with electric glow */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-xl animate-pulse"
              style={{ animationDuration: '2s' }}
            />
            <div className="relative w-full h-full rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <img
                src="/NextNode-Logo.svg"
                alt="NextNode"
                className="w-20 h-20 object-contain filter brightness-0 invert"
              />
            </div>
          </div>
        </div>

        {/* Loading text with typewriter effect */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 animate-pulse">
            NextNode
          </h1>
          <p className="text-muted-foreground text-sm animate-fade-in">
            Powering up AI tools for your success...
          </p>
        </div>

        {/* Progress bar with electric effect */}
        <div className="relative mb-6">
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            {Math.round(Math.min(progress, 100))}%
          </div>
        </div>

        {/* Pulsating dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner electric effects */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-30">
        <div className="w-full h-0.5 bg-gradient-to-r from-primary to-transparent animate-pulse" />
        <div className="w-0.5 h-full bg-gradient-to-b from-primary to-transparent animate-pulse" />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30">
        <div className="absolute bottom-0 w-full h-0.5 bg-gradient-to-l from-primary to-transparent animate-pulse" />
        <div className="absolute right-0 w-0.5 h-full bg-gradient-to-t from-primary to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingPage;
