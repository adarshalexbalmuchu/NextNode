/**
 * Analytics integration for Quantum Read Flow
 * Supports multiple analytics providers with privacy-focused approach
 */

export interface AnalyticsEvent {
  name: string;
  category?: string;
  properties?: Record<string, any>;
  value?: number;
}

export interface AnalyticsUser {
  id?: string;
  email?: string;
  properties?: Record<string, any>;
}

export interface AnalyticsConfig {
  enabledProviders: string[];
  googleAnalytics?: {
    measurementId: string;
    anonymizeIp?: boolean;
    respectDnt?: boolean;
  };
  plausible?: {
    domain: string;
    apiHost?: string;
    trackLocalhost?: boolean;
  };
  umami?: {
    websiteId: string;
    scriptUrl: string;
    domains?: string[];
  };
  mixpanel?: {
    token: string;
    debug?: boolean;
  };
  debug?: boolean;
  respectDnt?: boolean;
  cookieConsent?: boolean;
}

class AnalyticsManager {
  private config: AnalyticsConfig;
  private providers: Map<string, any> = new Map();
  private consentGiven = false;
  private initialized = false;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.checkDoNotTrack();
    this.initializeProviders();
  }

  private checkDoNotTrack(): boolean {
    if (this.config.respectDnt !== false) {
      const dnt = navigator.doNotTrack || (window as any).doNotTrack || navigator.msDoNotTrack;
      if (dnt === '1' || dnt === 'yes') {
        console.log('🔒 Analytics: Respecting Do Not Track preference');
        return false;
      }
    }
    return true;
  }

  private async initializeProviders() {
    if (!this.checkDoNotTrack()) {
      return;
    }

    for (const provider of this.config.enabledProviders) {
      try {
        switch (provider) {
          case 'google-analytics':
            await this.initGoogleAnalytics();
            break;
          case 'plausible':
            await this.initPlausible();
            break;
          case 'umami':
            await this.initUmami();
            break;
          case 'mixpanel':
            await this.initMixpanel();
            break;
          default:
            console.warn(`📊 Analytics: Unknown provider ${provider}`);
        }
      } catch (error) {
        console.error(`📊 Analytics: Failed to initialize ${provider}:`, error);
      }
    }

    this.initialized = true;
    if (this.config.debug) {
      console.log('📊 Analytics: Initialized providers:', this.providers.keys());
    }
  }

  private async initGoogleAnalytics() {
    if (!this.config.googleAnalytics?.measurementId) {
      throw new Error('Google Analytics measurement ID not provided');
    }

    const { measurementId, anonymizeIp = true } = this.config.googleAnalytics;

    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      anonymize_ip: anonymizeIp,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    this.providers.set('google-analytics', { gtag, measurementId });
  }

  private async initPlausible() {
    if (!this.config.plausible?.domain) {
      throw new Error('Plausible domain not provided');
    }

    const { domain, apiHost = 'https://plausible.io', trackLocalhost = false } = this.config.plausible;

    // Don't track on localhost unless explicitly enabled
    if (!trackLocalhost && window.location.hostname === 'localhost') {
      return;
    }

    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', domain);
    script.src = `${apiHost}/js/script.js`;
    document.head.appendChild(script);

    this.providers.set('plausible', { domain, apiHost });
  }

  private async initUmami() {
    if (!this.config.umami?.websiteId || !this.config.umami?.scriptUrl) {
      throw new Error('Umami configuration incomplete');
    }

    const { websiteId, scriptUrl, domains } = this.config.umami;

    // Check if current domain is allowed
    if (domains && !domains.includes(window.location.hostname)) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-website-id', websiteId);
    script.src = scriptUrl;
    document.head.appendChild(script);

    this.providers.set('umami', { websiteId });
  }

  private async initMixpanel() {
    if (!this.config.mixpanel?.token) {
      throw new Error('Mixpanel token not provided');
    }

    const { token, debug = false } = this.config.mixpanel;

    // Load Mixpanel
    const script = document.createElement('script');
    script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
    document.head.appendChild(script);

    await new Promise((resolve) => {
      script.onload = resolve;
    });

    (window as any).mixpanel.init(token, {
      debug,
      track_pageview: false, // We'll handle this manually
      persistence: 'localStorage',
    });

    this.providers.set('mixpanel', (window as any).mixpanel);
  }

  /**
   * Set user consent for analytics tracking
   */
  setConsent(consent: boolean) {
    this.consentGiven = consent;
    
    if (!consent) {
      // Clear any existing tracking data
      this.clearTrackingData();
    }

    if (this.config.debug) {
      console.log(`📊 Analytics: Consent ${consent ? 'granted' : 'revoked'}`);
    }
  }

  /**
   * Track page view
   */
  trackPageView(path?: string, title?: string) {
    if (!this.shouldTrack()) return;

    const url = path || window.location.pathname;
    const pageTitle = title || document.title;

    // Google Analytics
    if (this.providers.has('google-analytics')) {
      const { gtag } = this.providers.get('google-analytics');
      gtag('config', this.config.googleAnalytics?.measurementId, {
        page_path: url,
        page_title: pageTitle,
      });
    }

    // Plausible (automatic page views)
    if (this.providers.has('plausible') && (window as any).plausible) {
      (window as any).plausible('pageview');
    }

    // Umami (automatic page views)
    if (this.providers.has('umami') && (window as any).umami) {
      (window as any).umami.track();
    }

    // Mixpanel
    if (this.providers.has('mixpanel')) {
      const mixpanel = this.providers.get('mixpanel');
      mixpanel.track('Page View', {
        page: url,
        title: pageTitle,
      });
    }

    if (this.config.debug) {
      console.log('📊 Analytics: Page view tracked', { url, pageTitle });
    }
  }

  /**
   * Track custom event
   */
  trackEvent(event: AnalyticsEvent) {
    if (!this.shouldTrack()) return;

    const { name, category, properties = {}, value } = event;

    // Google Analytics
    if (this.providers.has('google-analytics')) {
      const { gtag } = this.providers.get('google-analytics');
      gtag('event', name, {
        event_category: category,
        event_label: properties.label,
        value,
        ...properties,
      });
    }

    // Plausible
    if (this.providers.has('plausible') && (window as any).plausible) {
      (window as any).plausible(name, { props: properties });
    }

    // Umami
    if (this.providers.has('umami') && (window as any).umami) {
      (window as any).umami.track(name, properties);
    }

    // Mixpanel
    if (this.providers.has('mixpanel')) {
      const mixpanel = this.providers.get('mixpanel');
      mixpanel.track(name, { category, ...properties });
    }

    if (this.config.debug) {
      console.log('📊 Analytics: Event tracked', event);
    }
  }

  /**
   * Identify user
   */
  identifyUser(user: AnalyticsUser) {
    if (!this.shouldTrack()) return;

    // Google Analytics
    if (this.providers.has('google-analytics') && user.id) {
      const { gtag } = this.providers.get('google-analytics');
      gtag('config', this.config.googleAnalytics?.measurementId, {
        user_id: user.id,
      });
    }

    // Mixpanel
    if (this.providers.has('mixpanel') && user.id) {
      const mixpanel = this.providers.get('mixpanel');
      mixpanel.identify(user.id);
      if (user.properties) {
        mixpanel.people.set(user.properties);
      }
    }

    if (this.config.debug) {
      console.log('📊 Analytics: User identified', { id: user.id });
    }
  }

  /**
   * Clear tracking data
   */
  private clearTrackingData() {
    // Clear localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('_ga') || key.startsWith('mp_') || key.includes('plausible')) {
        localStorage.removeItem(key);
      }
    });

    // Clear cookies
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (name.startsWith('_ga') || name.startsWith('mp_')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });
  }

  private shouldTrack(): boolean {
    if (!this.initialized) return false;
    if (this.config.cookieConsent && !this.consentGiven) return false;
    return this.checkDoNotTrack();
  }
}

// Default configuration
export const defaultAnalyticsConfig: AnalyticsConfig = {
  enabledProviders: [],
  respectDnt: true,
  cookieConsent: true,
  debug: process.env.NODE_ENV === 'development',
};

// Global analytics instance
let analyticsInstance: AnalyticsManager | null = null;

/**
 * Initialize analytics
 */
export function initAnalytics(config: Partial<AnalyticsConfig> = {}) {
  const finalConfig = { ...defaultAnalyticsConfig, ...config };
  analyticsInstance = new AnalyticsManager(finalConfig);
  return analyticsInstance;
}

/**
 * Get analytics instance
 */
export function getAnalytics(): AnalyticsManager | null {
  return analyticsInstance;
}

/**
 * Convenience functions
 */
export const analytics = {
  init: initAnalytics,
  trackPageView: (path?: string, title?: string) => analyticsInstance?.trackPageView(path, title),
  trackEvent: (event: AnalyticsEvent) => analyticsInstance?.trackEvent(event),
  identifyUser: (user: AnalyticsUser) => analyticsInstance?.identifyUser(user),
  setConsent: (consent: boolean) => analyticsInstance?.setConsent(consent),
};

/**
 * React hook for analytics
 */
export function useAnalytics() {
  return analytics;
}

// Blog-specific tracking events
export const BlogEvents = {
  POST_VIEW: 'blog_post_view',
  POST_LIKE: 'blog_post_like',
  POST_SHARE: 'blog_post_share',
  POST_COMMENT: 'blog_post_comment',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  USER_REGISTRATION: 'user_registration',
  USER_LOGIN: 'user_login',
} as const;
