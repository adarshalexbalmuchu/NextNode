
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
      analytics.trackEvent({
        event,
        properties,
        timestamp: Date.now(),
        userId: properties?.userId,
        sessionId: properties?.sessionId,
      });
    }
  };

  const identify = (userId: string, traits?: Record<string, any>) => {
    if (analytics) {
      analytics.identifyUser({
        id: userId,
        email: traits?.email,
        name: traits?.name,
        createdAt: traits?.createdAt,
        plan: traits?.plan,
      });
    }
  };

  const page = (name?: string, properties?: Record<string, any>) => {
    if (analytics) {
      analytics.trackPageView(name, properties?.title);
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
