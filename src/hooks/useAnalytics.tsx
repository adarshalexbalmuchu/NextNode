import React, { createContext, useContext, ReactNode } from 'react';
import { analytics } from '@/utils/analytics';

interface AnalyticsContextType {
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  page: (name?: string, properties?: Record<string, any>) => void;
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
  const track = (event: string, properties?: Record<string, any>) => {
    if (analytics) {
      analytics.track(event, properties);
    }
  };

  const identify = (userId: string, traits?: Record<string, any>) => {
    if (analytics) {
      analytics.identify(userId, traits);
    }
  };

  const page = (name?: string, properties?: Record<string, any>) => {
    if (analytics) {
      analytics.page(name, properties);
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