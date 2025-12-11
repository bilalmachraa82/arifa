import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Configuration - Set your analytics provider
const ANALYTICS_CONFIG = {
  // Plausible Analytics (recommended - privacy-friendly, no cookies)
  plausible: {
    enabled: true,
    domain: "arifa.studio", // Change to your domain
  },
  // Google Analytics (optional alternative)
  googleAnalytics: {
    enabled: false,
    measurementId: "", // e.g., "G-XXXXXXXXXX"
  },
};

// Track page views
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track with Plausible
    if (ANALYTICS_CONFIG.plausible.enabled && window.plausible) {
      window.plausible("pageview");
    }

    // Track with Google Analytics
    if (ANALYTICS_CONFIG.googleAnalytics.enabled && window.gtag) {
      window.gtag("config", ANALYTICS_CONFIG.googleAnalytics.measurementId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}

// Track custom events
export function trackEvent(eventName: string, props?: Record<string, string | number | boolean>) {
  // Plausible
  if (ANALYTICS_CONFIG.plausible.enabled && window.plausible) {
    window.plausible(eventName, { props });
  }

  // Google Analytics
  if (ANALYTICS_CONFIG.googleAnalytics.enabled && window.gtag) {
    window.gtag("event", eventName, props);
  }
}

// Declare global types
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
    gtag?: (...args: any[]) => void;
  }
}

// Analytics script loader component
export function AnalyticsScripts() {
  useEffect(() => {
    // Load Plausible
    if (ANALYTICS_CONFIG.plausible.enabled) {
      const script = document.createElement("script");
      script.defer = true;
      script.dataset.domain = ANALYTICS_CONFIG.plausible.domain;
      script.src = "https://plausible.io/js/script.js";
      document.head.appendChild(script);

      // Create plausible function before script loads
      window.plausible = window.plausible || function(...args: any[]) {
        (window as any).plausible.q = (window as any).plausible.q || [];
        (window as any).plausible.q.push(args);
      };
    }

    // Load Google Analytics
    if (ANALYTICS_CONFIG.googleAnalytics.enabled && ANALYTICS_CONFIG.googleAnalytics.measurementId) {
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.googleAnalytics.measurementId}`;
      document.head.appendChild(script1);

      window.gtag = window.gtag || function(...args: any[]) {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push(args);
      };

      window.gtag("js", new Date());
      window.gtag("config", ANALYTICS_CONFIG.googleAnalytics.measurementId);
    }
  }, []);

  return null;
}

// Analytics provider component
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  usePageTracking();

  return <>{children}</>;
}
