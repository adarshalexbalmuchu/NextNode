
import React, { useEffect, useState } from 'react';

const LoadingPage: React.FC = () => {
  const [showLightning, setShowLightning] = useState(false);
  const [logoGlow, setLogoGlow] = useState(false);

  useEffect(() => {
    // Start lightning after 500ms
    const lightningTimer = setTimeout(() => {
      setShowLightning(true);
    }, 500);

    // Trigger logo glow when lightning hits (after 1.2s)
    const glowTimer = setTimeout(() => {
      setLogoGlow(true);
    }, 1200);

    return () => {
      clearTimeout(lightningTimer);
      clearTimeout(glowTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center overflow-hidden">
      
      {/* Single Lightning Strike */}
      {showLightning && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <div 
            className="w-1 bg-gradient-to-b from-primary via-primary to-transparent opacity-0 animate-lightning-strike"
            style={{ 
              height: '100vh',
              boxShadow: `
                0 0 20px hsl(var(--primary)),
                0 0 40px hsl(var(--primary)),
                0 0 60px hsl(var(--primary))
              `
            }}
          />
        </div>
      )}

      {/* Logo with Glow Effect */}
      <div className="relative z-10 text-center">
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto mb-4 relative">
            {/* Glow effect background */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                logoGlow 
                  ? 'bg-gradient-to-r from-primary/60 to-accent/60 blur-2xl scale-150' 
                  : 'bg-gradient-to-r from-primary/20 to-accent/20 blur-xl scale-100'
              }`}
            />
            {/* Logo container */}
            <div 
              className={`relative w-full h-full rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center transition-all duration-1000 ${
                logoGlow ? 'scale-110 brightness-150' : 'scale-100 brightness-100'
              }`}
            >
              <img
                src="/NextNode-Logo.svg"
                alt="NextNode"
                className="w-20 h-20 object-contain filter brightness-0 invert"
              />
            </div>
          </div>
        </div>

        {/* Simple text */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          NextNode
        </h1>
        <p className="text-muted-foreground text-sm">
          Powering up...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
