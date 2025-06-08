
import React, { createContext, useContext, ReactNode } from 'react';
import { analytics } from '@/utils/analytics';

interface AnalyticsContextType {
  track: (name: string, properties?: Record<string, any>) => void;
  identify: (id: string, properties?: Record<string, any>) => void;
  page: (path?: string, properties?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const track = (name: string, properties?: Record<string, any>) => {
    if (analytics) {
      analytics.trackEvent({
        name,
        properties,
      });
    }
  };

  const identify = (id: string, properties?: Record<string, any>) => {
    if (analytics) {
      analytics.identifyUser({
        id,
        properties,
      });
    }
  };

  const page = (path?: string, properties?: Record<string, any>) => {
    if (analytics) {
      analytics.trackPageView(path, properties?.title);
    }
  };

  const value = {
    track,
    identify,
    page,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
