
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
      
      {/* Enhanced Lightning Strike */}
      {showLightning && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          {/* Main lightning bolt */}
          <div 
            className="w-2 bg-gradient-to-b from-primary via-white to-primary opacity-0 animate-lightning-strike"
            style={{ 
              height: '100vh',
              boxShadow: `
                0 0 30px hsl(var(--primary)),
                0 0 60px hsl(var(--primary)),
                0 0 90px hsl(var(--primary)),
                0 0 120px rgba(0, 255, 255, 0.8)
              `
            }}
          />
          {/* Lightning branches */}
          <div 
            className="absolute top-1/3 -left-8 w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 animate-lightning-strike"
            style={{ 
              transform: 'rotate(-45deg)',
              animationDelay: '0.1s',
              boxShadow: `0 0 20px hsl(var(--primary))`
            }}
          />
          <div 
            className="absolute top-1/2 -right-6 w-12 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 animate-lightning-strike"
            style={{ 
              transform: 'rotate(30deg)',
              animationDelay: '0.15s',
              boxShadow: `0 0 20px hsl(var(--primary))`
            }}
          />
          <div 
            className="absolute top-2/3 -left-4 w-8 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 animate-lightning-strike"
            style={{ 
              transform: 'rotate(-30deg)',
              animationDelay: '0.2s',
              boxShadow: `0 0 15px hsl(var(--primary))`
            }}
          />
        </div>
      )}

      {/* Logo with Enhanced Glow Effect */}
      <div className="relative z-10">
        <div className="relative">
          <img
            src="/NextNode-Logo.svg"
            alt="NextNode"
            className={`w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain transition-all duration-1000 ${
              logoGlow 
                ? 'brightness-200 drop-shadow-[0_0_50px_hsl(var(--primary))] drop-shadow-[0_0_100px_rgba(0,255,255,0.6)] scale-110' 
                : 'brightness-100 scale-100'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
